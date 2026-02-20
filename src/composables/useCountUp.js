import { ref, computed, onMounted, watch } from 'vue'

export function useCountUp(endValue, duration = 2000, startOnMount = true) {
  const currentValue = ref(0)
  const startTime = ref(null)
  const animationFrame = ref(null)

  const animate = (timestamp) => {
    if (!startTime.value) {
      startTime.value = timestamp
    }

    const elapsed = timestamp - startTime.value
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out-circ)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    currentValue.value = Math.floor(easeOut * endValue)

    if (progress < 1) {
      animationFrame.value = requestAnimationFrame(animate)
    }
  }

  const start = () => {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value)
    }
    startTime.value = null
    currentValue.value = 0
    animationFrame.value = requestAnimationFrame(animate)
  }

  const stop = () => {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value)
    }
  }

  onMounted(() => {
    if (startOnMount) {
      start()
    }
  })

  watch(() => endValue, () => {
    start()
  })

  return {
    value: computed(() => currentValue.value),
    start,
    stop
  }
}

// Форматирование чисел
export function formatNumber(num, locale = 'ru-RU') {
  return new Intl.NumberFormat(locale).format(num)
}
