<script>
import {HorizontalBar} from 'vue-chartjs'

export default {
  extends: HorizontalBar,
  name: 'barchart',
  props: {
    test: {
      type: String
      },
  },
  mounted () {
      console.log(this.test);
      const chartOptions = {
            scales: {
              xAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
            },
        responsive: true,
        maintainAspectRatio: false,

      }

//TODO: Erstzen mit request
    const data = require('../../../../Backend/example_response.json')
    let arrCounties = []
    let arrCases = []
    console.log(data.states)
    
    data.states[0].counties.forEach (county => {

      console.log(county)

      arrCounties.push(county.LK)
      arrCases.push(county.cases_LK)
      console.log(arrCounties)
      console.log(arrCases)
    })

    this.renderChart ({
      labels: arrCounties,
      datasets: [{
        label: "Total 100k",
        data: arrCases
      }]
    },chartOptions)
  }
}
</script>