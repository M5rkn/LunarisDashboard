import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMetricsStore = defineStore('metrics', () => {
  // Состояние
  const metrics = ref([
    { id: 1, name: 'Пользователи', value: 12543, change: 12.5, trend: 'up', icon: 'mdi-account-group', iconBg: 'rgba(102, 126, 234, 0.1)', iconColor: '#a7b7ff' },
    { id: 2, name: 'Заказы', value: 3456, change: 8.2, trend: 'up', icon: 'mdi-shopping', iconBg: 'rgba(74, 222, 128, 0.1)', iconColor: '#86efac' },
    { id: 3, name: 'Выручка', value: 125000, change: -3.1, trend: 'down', prefix: '$', icon: 'mdi-currency-usd', iconBg: 'rgba(96, 165, 250, 0.1)', iconColor: '#93c5fd' },
    { id: 4, name: 'Конверсия', value: 3.2, change: 0.5, trend: 'up', suffix: '%', icon: 'mdi-chart-timeline-variant', iconBg: 'rgba(248, 113, 113, 0.1)', iconColor: '#fca5a5' }
  ])

  const chartData = ref({
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
    users: [1200, 1900, 1500, 2200, 2800, 3100],
    orders: [320, 450, 380, 520, 610, 720],
    revenue: [45000, 52000, 48000, 61000, 72000, 85000]
  })

  // Геттеры
  const totalUsers = computed(() => metrics.value.find(m => m.name === 'Пользователи')?.value || 0)
  const totalRevenue = computed(() => metrics.value.find(m => m.name === 'Выручка')?.value || 0)

  // Действия
  function updateMetric(id, value) {
    const metric = metrics.value.find(m => m.id === id)
    if (metric) {
      metric.value = value
    }
  }

  function setChartData(data) {
    chartData.value = { ...chartData.value, ...data }
  }

  return {
    metrics,
    chartData,
    totalUsers,
    totalRevenue,
    updateMetric,
    setChartData
  }
})
