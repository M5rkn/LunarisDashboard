import { defineComponent, h } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default defineComponent({
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.canvas.getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: this.data,
        options: this.options
      })
    }
  },
  render() {
    return h('canvas', { ref: 'canvas' })
  }
})
