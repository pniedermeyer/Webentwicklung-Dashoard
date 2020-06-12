
<script>
import {HorizontalBar} from 'vue-chartjs'

export default {
  extends: HorizontalBar,
  props: {
    label: {
      type: String
      },
    chartData: {
      type: Array
    },
    options: {
      type: Object
    }

  },
  mounted () {

    const county = this.chartData.map(d => d)
    const totals = this.chartData.map(d => d)


    this.renderChart ({
      labels: county,
      datasets: [{
        label: this.label,
        data: totals
      }]
    },this.options)
  }

}
</script>