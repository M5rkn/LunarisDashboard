<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        <div class="toast-icon">
          <v-icon
            :icon="toast.icon"
            size="20"
            :color="getIconColor(toast.type)"
          ></v-icon>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" @click="remove(toast.id)">
          <v-icon size="16">mdi-close</v-icon>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

const getIconColor = (type) => {
  const colors = {
    success: '#4ade80',
    error: '#f87171',
    warning: '#fbbf24',
    info: '#667eea'
  }
  return colors[type] || '#667eea'
}

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

defineExpose({
  success,
  error,
  warning,
  info,
  add,
  remove
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 90px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  min-width: 320px;
  padding: 16px 20px;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  right: 0;
}

.toast-success {
  background: rgba(74, 222, 128, 0.15);
  border-color: rgba(74, 222, 128, 0.3);
}

.toast-error {
  background: rgba(248, 113, 113, 0.15);
  border-color: rgba(248, 113, 113, 0.3);
}

.toast-warning {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.3);
}

.toast-info {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.toast-icon {
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.toast-message {
  font-size: 0.85rem;
  opacity: 0.8;
}

.toast-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

@media (max-width: 600px) {
  .toast-container {
    left: 16px;
    right: 16px;
    max-width: none;
  }

  .toast {
    min-width: auto;
  }
}
</style>
