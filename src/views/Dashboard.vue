<template>
  <div class="dashboard">
    <!-- Заголовок -->
    <div class="page-header mb-6 animate-on-scroll animate-fade-in-down">
      <div>
        <h1 class="page-title">Обзор</h1>
        <p class="page-subtitle">Добро пожаловать назад! Вот что происходит сегодня.</p>
      </div>
      <v-btn class="gradient-btn" rounded="xl" @click="downloadReport">
        <v-icon start>mdi-download</v-icon>
        Скачать отчёт
      </v-btn>
    </div>

    <!-- Карточки метрик -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3" v-for="(metric, index) in metrics" :key="metric.id">
        <v-card class="metric-card card-hover-lift animate-on-scroll animate-scale-in" :style="{ transitionDelay: `${index * 100}ms` }">
          <div class="metric-card-inner">
            <div class="metric-icon-wrapper" :style="{ background: metric.iconBg }">
              <v-icon :color="metric.iconColor" size="24">{{ metric.icon }}</v-icon>
            </div>
            <div class="metric-content">
              <span class="metric-name">{{ metric.name }}</span>
              <div class="metric-value">
                {{ metric.prefix }}{{ formatNumber(metric.value) }}{{ metric.suffix }}
              </div>
              <div class="metric-change" :class="metric.trend">
                <v-icon size="14" :icon="metric.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'"></v-icon>
                <span>{{ metric.change }}%</span>
                <span class="change-label">к прошлому месяцу</span>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Графики -->
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <v-card class="chart-card animate-on-scroll animate-fade-in-up" elevation="0">
          <div class="card-header">
            <div>
              <h3 class="card-title">Динамика пользователей</h3>
              <p class="card-subtitle">Рост за последние 6 месяцев</p>
            </div>
            <v-btn-toggle variant="outlined" density="compact" rounded="lg" v-model="chartPeriod" class="period-toggle">
              <v-btn size="small">6М</v-btn>
              <v-btn size="small">1Г</v-btn>
            </v-btn-toggle>
          </div>
          <div class="chart-wrapper">
            <LineChart :data="usersChartData" :options="chartOptions" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="chart-card animate-on-scroll animate-fade-in-up" elevation="0" style="transition-delay: 100ms">
          <div class="card-header">
            <h3 class="card-title">Распределение</h3>
            <p class="card-subtitle">По статусам заказов</p>
          </div>
          <div class="chart-wrapper doughnut-wrapper">
            <DoughnutChart :data="ordersChartData" :options="doughnutOptions" />
          </div>
          <div class="legend-custom">
            <div v-for="(item, i) in orderLegend" :key="i" class="legend-item">
              <span class="legend-dot" :style="{ background: item.color }"></span>
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}%</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Таблица -->
    <v-row>
      <v-col cols="12">
        <v-card class="table-card animate-on-scroll animate-fade-in-up" elevation="0" style="transition-delay: 200ms">
          <div class="card-header">
            <div>
              <h3 class="card-title">Последние заказы</h3>
              <p class="card-subtitle">5 последних транзакций</p>
            </div>
            <v-btn variant="text" rounded="lg" @click="exportTable">
              <v-icon start>mdi-file-excel</v-icon>
              Экспорт
            </v-btn>
          </div>
          <v-table class="modern-table" density="comfortable">
            <thead>
              <tr>
                <th class="text-left">ID заказа</th>
                <th class="text-left">Клиент</th>
                <th class="text-left">Сумма</th>
                <th class="text-left">Дата</th>
                <th class="text-left">Статус</th>
                <th class="text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id" class="table-row">
                <td>
                  <span class="order-id">{{ order.id }}</span>
                </td>
                <td>
                  <div class="customer-cell">
                    <v-avatar size="32" :color="getAvatarColor(order.customer)">
                      {{ getInitials(order.customer) }}
                    </v-avatar>
                    <span class="customer-name">{{ order.customer }}</span>
                  </div>
                </td>
                <td>
                  <span class="amount">{{ order.amount }}</span>
                </td>
                <td>
                  <span class="date">{{ order.date }}</span>
                </td>
                <td>
                  <v-chip :color="getStatusColor(order.status)" size="small" class="status-chip">
                    <span class="status-dot" :style="{ background: getStatusDotColor(order.status) }"></span>
                    {{ order.status }}
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-btn icon size="small" variant="text">
                    <v-icon size="18">mdi-dots-horizontal</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useMetricsStore } from '@/stores/metrics'
import LineChart from '@/components/LineChart.js'
import DoughnutChart from '@/components/DoughnutChart.js'

const store = useMetricsStore()
const { metrics, chartData } = store
const chartPeriod = ref(0)

// Анимации при скролле
onMounted(() => {
  nextTick(() => {
    initScrollAnimations()
  })
})

const initScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated')
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
}

// Данные для линейного графика
const usersChartData = computed(() => ({
  labels: chartData.labels,
  datasets: [
    {
      label: 'Пользователи',
      data: chartData.users,
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#667eea',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
}))

// Данные для круговой диаграммы
const ordersChartData = computed(() => ({
  labels: ['Новые', 'В обработке', 'Завершённые', 'Отменённые'],
  datasets: [
    {
      data: [25, 35, 30, 10],
      backgroundColor: [
        '#4ade80',
        '#60a5fa',
        '#667eea',
        '#f87171'
      ],
      borderWidth: 0,
      spacing: 2
    }
  ]
}))

// Легенда для круговой диаграммы
const orderLegend = [
  { label: 'Новые', value: 25, color: '#4ade80' },
  { label: 'В обработке', value: 35, color: '#60a5fa' },
  { label: 'Завершённые', value: 30, color: '#667eea' },
  { label: 'Отменённые', value: 10, color: '#f87171' }
]

// Опции графика
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(15, 12, 41, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 12,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)'
      },
      beginAtZero: true
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(15, 12, 41, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 12,
      displayColors: false
    }
  }
}

// Заголовки таблицы
const headers = [
  { title: 'ID заказа', key: 'id' },
  { title: 'Клиент', key: 'customer' },
  { title: 'Сумма', key: 'amount' },
  { title: 'Дата', key: 'date' },
  { title: 'Статус', key: 'status' }
]

// Данные заказов
const orders = [
  { id: '#12345', customer: 'Иван Петров', amount: '$125.00', date: '19 фев 2026', status: 'Завершён' },
  { id: '#12346', customer: 'Мария Сидорова', amount: '$89.50', date: '19 фев 2026', status: 'В обработке' },
  { id: '#12347', customer: 'Алексей Козлов', amount: '$234.00', date: '18 фев 2026', status: 'Новый' },
  { id: '#12348', customer: 'Елена Новикова', amount: '$67.00', date: '18 фев 2026', status: 'Завершён' },
  { id: '#12349', customer: 'Дмитрий Волков', amount: '$412.00', date: '17 фев 2026', status: 'Отменён' }
]

// Форматирование чисел
const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}

// Цвет статуса
const getStatusColor = (status) => {
  const colors = {
    'Новый': 'transparent',
    'В обработке': 'transparent',
    'Завершён': 'transparent',
    'Отменён': 'transparent'
  }
  return colors[status] || 'grey'
}

const getStatusDotColor = (status) => {
  const colors = {
    'Новый': '#4ade80',
    'В обработке': '#60a5fa',
    'Завершён': '#667eea',
    'Отменён': '#f87171'
  }
  return colors[status] || '#999'
}

const getAvatarColor = (name) => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']
  const index = name.length % colors.length
  return colors[index]
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Экспорт таблицы
const exportTable = () => {
  const csvContent = [
    headers.map(h => h.title).join(','),
    ...orders.map(row =>
      headers.map(h => row[h.key]).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'orders_export.csv'
  link.click()
}

// Скачать отчёт
const downloadReport = () => {
  const content = `
Отчёт Dashboard Analytics
Дата: ${new Date().toLocaleDateString('ru-RU')}

Метрики:
${store.metrics.map(m => `${m.name}: ${m.value}`).join('\n')}
  `.trim()

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `dashboard_report_${new Date().getTime()}.txt`
  link.click()
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

/* Анимации при скролле */
.animate-on-scroll {
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.animated {
  opacity: 1;
}

.animate-fade-in-down {
  transform: translateY(-30px);
}

.animate-on-scroll.animated.animate-fade-in-down {
  transform: translateY(0);
}

.animate-scale-in {
  transform: scale(0.9);
}

.animate-on-scroll.animated.animate-scale-in {
  transform: scale(1);
}

.animate-fade-in-up {
  transform: translateY(30px);
}

.animate-on-scroll.animated.animate-fade-in-up {
  transform: translateY(0);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  max-width: 100%;
  overflow-wrap: break-word;
  padding-right: 8px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin: 4px 0 0 0;
  font-size: 0.95rem;
}

.gradient-btn {
  background: rgba(102, 126, 234, 0.15);
  color: #a7b7ff;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gradient-btn:hover {
  background: rgba(102, 126, 234, 0.25);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* Карточки метрик */
.metric-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  min-width: 0;
  position: relative;
}

.metric-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.metric-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.3);
}

.metric-card:hover::before {
  opacity: 1;
}

.metric-card-inner {
  padding: 24px;
  display: flex;
  gap: 16px;
}

.metric-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.metric-content {
  flex: 1;
}

.metric-name {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 4px 0;
  letter-spacing: -0.5px;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 8px;
}

.metric-change.up {
  color: #4ade80;
}

.metric-change.down {
  color: #f87171;
}

.change-label {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 400;
}

/* Карточки графиков */
.chart-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  height: 100%;
  min-width: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.chart-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  transition: left 0.6s;
  pointer-events: none;
}

.chart-card:hover {
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.chart-card:hover::after {
  left: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.card-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin: 4px 0 0 0;
}

.period-toggle {
  border-color: rgba(255, 255, 255, 0.2);
}

.period-toggle .v-btn {
  color: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.2);
}

.period-toggle .v-btn.v-btn--active {
  background: rgba(102, 126, 234, 0.3);
  color: #fff;
  border-color: rgba(102, 126, 234, 0.5);
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

.doughnut-wrapper {
  height: 200px;
}

/* Кастомная легенда */
.legend-custom {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.legend-value {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Таблица */
.table-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  min-width: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
}

.table-card:hover {
  border-color: rgba(102, 126, 234, 0.2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modern-table {
  background: transparent;
  width: 100%;
  display: table;
  overflow-x: hidden;
}

.modern-table :deep(th) {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
  padding: 12px 16px;
}

.modern-table :deep(td) {
  background: transparent;
  color: #fff;
  border: none;
  padding: 16px;
  font-size: 0.9rem;
  transition: all 0.2s;
  vertical-align: middle;
}

.table-row {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-row:hover {
  background: rgba(102, 126, 234, 0.08);
}

.order-id {
  font-weight: 600;
  color: #667eea;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 32px;
}

.customer-name {
  font-weight: 500;
}

.amount {
  font-weight: 600;
  color: #4ade80;
}

.date {
  color: rgba(255, 255, 255, 0.5);
}

.status-chip {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  display: inline-block;
}

/* Адаптивность */
@media (max-width: 960px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 0 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .metric-card-inner {
    padding: 20px;
  }
}

@media (max-width: 600px) {
  .page-header {
    padding: 0 16px;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .page-subtitle {
    font-size: 0.85rem;
  }

  .metric-card-inner {
    padding: 16px;
    flex-direction: column;
    text-align: center;
  }

  .metric-icon-wrapper {
    width: 48px;
    height: 48px;
    margin: 0 auto 8px;
  }

  .metric-value {
    font-size: 1.5rem;
  }

  .metric-change {
    justify-content: center;
  }

  .chart-card,
  .table-card {
    padding: 16px;
    margin: 0;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    padding: 0 8px;
  }

  .card-title {
    font-size: 1rem;
  }

  .modern-table {
    font-size: 0.85rem;
  }

  .modern-table :deep(th),
  .modern-table :deep(td) {
    padding: 16px 8px;
    vertical-align: middle;
  }

  .customer-cell {
    gap: 12px;
    align-items: center;
  }

  .status-chip {
    font-size: 0.75rem;
    justify-content: center;
  }

  .status-dot {
    margin-right: 4px;
  }
}
</style>
