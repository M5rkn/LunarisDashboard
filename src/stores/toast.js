import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let toastId = 0

  const getIcon = (type) => {
    const icons = {
      success: 'mdi-check-circle',
      error: 'mdi-alert-circle',
      warning: 'mdi-alert',
      info: 'mdi-information'
    }
    return icons[type] || 'mdi-information'
  }

  const add = (title, message, type = 'info', duration = 5000) => {
    const id = toastId++
    toasts.value.push({
      id,
      title,
      message,
      type,
      icon: getIcon(type)
    })

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }

    return id
  }

  const remove = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title, message, duration) => add(title, message, 'success', duration)
  const error = (title, message, duration) => add(title, message, 'error', duration)
  const warning = (title, message, duration) => add(title, message, 'warning', duration)
  const info = (title, message, duration) => add(title, message, 'info', duration)

  return {
    toasts,
    add,
    remove,
    success,
    error,
    warning,
    info
  }
})
