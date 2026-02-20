<template>
  <div class="reports-page">
    <div class="page-header mb-6 animate-on-scroll animate-fade-in-down">
      <div>
        <h1 class="page-title">Отчёты</h1>
        <p class="page-subtitle">Генерация и экспорт аналитических данных</p>
      </div>
    </div>

    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <v-card class="form-card animate-on-scroll animate-scale-in" elevation="0">
          <div class="card-header">
            <h3 class="card-title">Параметры отчёта</h3>
            <p class="card-subtitle">Настройте фильтры для генерации</p>
          </div>

          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="reportType"
                :items="reportTypes"
                label="Тип отчёта"
                variant="outlined"
                rounded="xl"
                class="modern-select"
              >
                <template v-slot:prepend-inner>
                  <v-icon icon="mdi-file-chart" color="primary"></v-icon>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dateFrom"
                type="date"
                label="С даты"
                variant="outlined"
                rounded="xl"
                class="modern-select"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dateTo"
                type="date"
                label="По дату"
                variant="outlined"
                rounded="xl"
                class="modern-select"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="exportFormat"
                :items="exportFormats"
                label="Формат экспорта"
                variant="outlined"
                rounded="xl"
                class="modern-select"
              >
                <template v-slot:prepend-inner>
                  <v-icon icon="mdi-download" color="primary"></v-icon>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <div class="options-row">
            <v-checkbox
              v-model="includeCharts"
              label="Включить графики и диаграммы"
              hide-details
              class="modern-checkbox"
            ></v-checkbox>
            <v-checkbox
              v-model="includeRawData"
              label="Включить сырые данные"
              hide-details
              class="modern-checkbox"
            ></v-checkbox>
            <v-checkbox
              v-model="sendEmail"
              label="Отправить на email"
              hide-details
              class="modern-checkbox"
            ></v-checkbox>
          </div>

          <div class="actions-row">
            <v-btn class="gradient-btn" rounded="xl" @click="generateReport">
              <v-icon start>mdi-file-document</v-icon>
              Сгенерировать отчёт
            </v-btn>
            <v-btn variant="outlined" rounded="xl" @click="downloadFromFirebase">
              <v-icon start>mdi-cloud-download</v-icon>
              Из Firebase
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="info-card animate-on-scroll animate-scale-in" elevation="0" style="transition-delay: 100ms">
          <div class="card-header">
            <h3 class="card-title">Быстрые отчёты</h3>
          </div>
          <v-list class="quick-list">
            <v-list-item
              v-for="item in quickReports"
              :key="item.id"
              rounded="xl"
              class="mb-2"
              @click="runQuickReport(item)"
            >
              <template v-slot:prepend>
                <div class="quick-icon" :style="{ background: item.iconBg }">
                  <v-icon :color="item.iconColor" size="20">{{ item.icon }}</v-icon>
                </div>
              </template>
              <v-list-item-title class="quick-title">{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle class="quick-subtitle">{{ item.subtitle }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Сгенерированный отчёт -->
    <v-row v-if="generatedReport" class="report-animate">
      <v-col cols="12">
        <v-card class="report-card" elevation="0">
          <div class="card-header">
            <div>
              <h3 class="card-title">{{ generatedReport.name }}</h3>
              <p class="card-subtitle">Создан {{ generatedReport.date }}</p>
            </div>
            <v-btn class="gradient-btn" rounded="xl" @click="downloadReport">
              <v-icon start>mdi-download</v-icon>
              Скачать
            </v-btn>
          </div>

          <v-alert type="info" variant="tonal" class="mb-4 info-alert">
            <v-icon start>mdi-check-circle</v-icon>
            Отчёт успешно сгенерирован и готов к скачиванию
          </v-alert>

          <v-table class="modern-table">
            <thead>
              <tr>
                <th>Метрика</th>
                <th>Значение</th>
                <th>Изменение</th>
                <th>Тренд</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in generatedReport.data" :key="item.metric">
                <td>
                  <span class="metric-name">{{ item.metric }}</span>
                </td>
                <td>
                  <span class="metric-value">{{ item.value }}</span>
                </td>
                <td>
                  <span :class="['metric-change', item.change >= 0 ? 'positive' : 'negative']">
                    {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                  </span>
                </td>
                <td>
                  <v-icon :color="item.change >= 0 ? '#4ade80' : '#f87171'" size="20">
                    {{ item.change >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- История отчётов -->
    <v-row class="mt-6" style="transition: all 0.5s ease;">
      <v-col cols="12">
        <v-card class="history-card animate-on-scroll animate-fade-in-up" elevation="0">
          <div class="card-header">
            <h3 class="card-title">История отчётов</h3>
            <v-btn variant="text" rounded="xl">
              <v-icon start>mdi-folder-open</v-icon>
              Открыть все
            </v-btn>
          </div>
          <v-list class="history-list">
            <v-list-item
              v-for="report in reportsHistory"
              :key="report.id"
              rounded="xl"
              class="history-item"
            >
              <template v-slot:prepend>
                <v-icon class="history-icon" icon="mdi-file-pdf" color="error"></v-icon>
              </template>
              <v-list-item-title class="history-title">{{ report.name }}</v-list-item-title>
              <v-list-item-subtitle class="history-subtitle">{{ report.date }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-chip :color="report.statusColor" size="small" class="status-chip">
                  {{ report.status }}
                </v-chip>
                <v-btn icon size="small" variant="text">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'

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

const reportType = ref('sales')
const dateFrom = ref('2026-02-01')
const dateTo = ref('2026-02-19')
const exportFormat = ref('pdf')
const includeCharts = ref(true)
const includeRawData = ref(false)
const sendEmail = ref(false)
const generatedReport = ref(null)

const reportTypes = [
  { title: 'Продажи', value: 'sales', icon: 'mdi-currency-usd' },
  { title: 'Пользователи', value: 'users', icon: 'mdi-account-group' },
  { title: 'Заказы', value: 'orders', icon: 'mdi-shopping' },
  { title: 'Финансы', value: 'finance', icon: 'mdi-bank' }
]

const exportFormats = [
  { title: 'PDF', value: 'pdf' },
  { title: 'Excel (XLSX)', value: 'xlsx' },
  { title: 'CSV', value: 'csv' },
  { title: 'JSON', value: 'json' }
]

const quickReports = [
  { id: 1, title: 'За сегодня', subtitle: 'Все метрики за текущий день', icon: 'mdi-calendar-today', iconBg: 'rgba(102, 126, 234, 0.1)', iconColor: '#a7b7ff' },
  { id: 2, title: 'За неделю', subtitle: 'Сводка за последние 7 дней', icon: 'mdi-calendar-week', iconBg: 'rgba(74, 222, 128, 0.1)', iconColor: '#86efac' },
  { id: 3, title: 'За месяц', subtitle: 'Полный отчёт за месяц', icon: 'mdi-calendar-month', iconBg: 'rgba(96, 165, 250, 0.1)', iconColor: '#93c5fd' },
  { id: 4, title: 'Сравнение', subtitle: 'Месяц к месяцу', icon: 'mdi-compare', iconBg: 'rgba(248, 113, 113, 0.1)', iconColor: '#fca5a5' }
]

const reportsHistory = ref([
  { id: 1, name: 'Отчёт по продажам (Январь 2026)', date: '1 февраля 2026', status: 'Готов', statusColor: 'success' },
  { id: 2, name: 'Пользователи (2025 год)', date: '15 января 2026', status: 'Готов', statusColor: 'success' },
  { id: 3, name: 'Финансовый отчёт (Q4 2025)', date: '31 декабря 2025', status: 'Готов', statusColor: 'success' },
  { id: 4, name: 'Анализ конверсии', date: '20 декабря 2025', status: 'Архив', statusColor: 'grey' }
])

const generateReport = async () => {
  generatedReport.value = {
    name: `Отчёт: ${reportTypes.find(t => t.value === reportType.value)?.title}`,
    date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    data: [
      { metric: 'Пользователи', value: '12,543', change: 12.5 },
      { metric: 'Заказы', value: '3,456', change: 8.2 },
      { metric: 'Выручка', value: '$125,000', change: -3.1 },
      { metric: 'Конверсия', value: '3.2%', change: 0.5 }
    ]
  }

  console.log('generatedReport установлен:', generatedReport.value)

  if (!db) {
    console.error('Firebase db не инициализирован')
    return
  }

  try {
    await addDoc(collection(db, 'reports'), {
      type: reportType.value,
      name: generatedReport.value.name,
      date: new Date().toISOString(),
      data: generatedReport.value.data
    })
    console.log('Отчёт сохранён в Firebase')
  } catch (e) {
    console.error('Ошибка сохранения в Firebase:', e.message)
  }
}

const downloadReport = () => {
  if (!generatedReport.value) return

  const content = `
Отчёт: ${generatedReport.value.name}
Дата: ${generatedReport.value.date}

${generatedReport.value.data.map(item =>
    `${item.metric}: ${item.value} (${item.change >= 0 ? '+' : ''}${item.change}%)`
  ).join('\n')}
  `.trim()

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `report_${new Date().getTime()}.txt`
  link.click()
}

const downloadFromFirebase = async () => {
  if (!db) {
    alert('Firebase db не инициализирован. Проверьте конфигурацию.')
    return
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'reports'))
    const reports = []
    querySnapshot.forEach((doc) => {
      reports.push(doc.data())
    })
    alert(`Найдено ${reports.length} отчётов в Firebase`)
  } catch (e) {
    console.error('Ошибка загрузки из Firebase:', e.message)
    alert(`Ошибка: ${e.message}`)
  }
}

const runQuickReport = (item) => {
  alert(`Запуск быстрого отчёта: ${item.title}`)
}
</script>

<style scoped>
.reports-page {
  padding: 0;
}

/* Анимация появления отчёта */
.report-animate {
  animation: reportSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes reportSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* Карточки */
.form-card,
.info-card,
.report-card,
.history-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  height: 100%;
  min-width: 0;
}

.card-header {
  margin-bottom: 24px;
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

/* Поля форм */
.modern-select :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modern-select :deep(.v-field__input) {
  color: #fff;
}

.modern-select :deep(.v-label) {
  color: rgba(255, 255, 255, 0.5);
}

.options-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 24px 0;
}

.modern-checkbox {
  color: rgba(255, 255, 255, 0.8);
}

.modern-checkbox :deep(.v-label) {
  color: rgba(255, 255, 255, 0.7);
}

.actions-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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

/* Быстрые отчёты */
.quick-list {
  background: transparent;
  padding: 0;
}

.quick-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.quick-title {
  font-weight: 600;
  color: #fff;
}

.quick-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
}

/* Таблица */
.modern-table {
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
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
}

.modern-table :deep(tbody tr:hover) {
  background: rgba(255, 255, 255, 0.03);
}

.metric-name {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.metric-value {
  font-weight: 700;
  color: #fff;
  font-size: 1.1rem;
}

.metric-change {
  font-weight: 600;
}

.metric-change.positive {
  color: #4ade80;
}

.metric-change.negative {
  color: #f87171;
}

.info-alert {
  background: rgba(102, 126, 234, 0.1) !important;
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #fff;
}

/* История */
.history-list {
  background: transparent;
  padding: 0;
}

.history-item {
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.history-icon {
  font-size: 24px;
}

.history-title {
  font-weight: 500;
  color: #fff;
}

.history-subtitle {
  color: rgba(255, 255, 255, 0.5);
}

.status-chip {
  margin-right: 8px;
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

  .actions-row {
    flex-direction: column;
  }

  .gradient-btn {
    width: 100%;
  }

  .form-card,
  .info-card {
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

  .form-card,
  .info-card,
  .report-card,
  .history-card {
    padding: 16px;
    margin: 0;
  }

  .options-row {
    flex-direction: column;
    gap: 12px;
  }

  .modern-checkbox {
    width: 100%;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    padding: 0 8px;
  }

  .card-title {
    font-size: 1rem;
  }

  .quick-list {
    padding: 8px 0;
  }

  .quick-icon {
    width: 36px;
    height: 36px;
  }

  .modern-table {
    font-size: 0.85rem;
  }

  .modern-table :deep(th),
  .modern-table :deep(td) {
    padding: 12px 8px;
  }

  .metric-name {
    font-size: 0.8rem;
  }

  .metric-value {
    font-size: 1rem;
  }

  .info-alert {
    font-size: 0.85rem;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .history-item :deep(.v-list-item__append) {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
