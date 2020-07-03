<script>
import { HorizontalBar } from 'vue-chartjs'
import { mapFields } from 'vuex-map-fields'
import {evaluateMaxData, selectTopCounty} from '../functions/barChartCalc.js'

export default {
  extends: HorizontalBar,
  name: 'barchart',
  data: () => ({
    arrID: [],
    selectedData: [],
    maxCases: {
      maxCasesLk: -1,
      maxCasesPer100kLk: -1,
      max7CasesPer100kLk: -1,
    },
  }),
  /**
   * INIT
   */
  mounted() {
    drawChart(this)
  },
  methods: {
    /**
     * Handles Click on a Bar -> Emits Event with index of clicked bar to notify other components
     */
    handle(point, event) {
      event[0] && this.BL_ID != 0 ? (this.LK_ID = this.arrID[event[0]._index]) : ''
    },
  },
  computed: {
    ...mapFields({
      barsShown: 'barsShown', 
      BL_ID: 'BL_ID', 
      LK_ID: 'LK_ID', 
      casesOption: 'casesOption', 
      allCasesOptions: 'allCasesOptions', 
      baseColor: 'baseColor', 
      infectionData: 'infectionData'
    }),
  },
  /**
   * Watches all corresponding data and redraws bars if data has changed
   */
  watch: {
    BL_ID: function() {
      drawChart(this)
    },
    barsShown: function() {
      drawChart(this)
    },
    infectionData: function() {
      evaluateMaxData(this)
      drawChart(this)
    },
    casesOption: function() {
      drawChart(this)
    },
    baseColor: function() {
      drawChart(this)
    }
  },
}
//END EXPORT

/**
 * Main Function that calculates all the Bar Chart Lenghts and calls helper functions
 */
function drawChart(parent) {
  const chartOptions = {
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    onClick: parent.handle,
  }

  const data = parent.infectionData
  let arrCounties = []
  let arrCases = []
  let arrTopCounty = []
  let backgroundColor = []
  let label = ''
  const hundred = 100

  parent.arrID = []

  //Get the Top Countys
  arrTopCounty = selectTopCounty(parent.barsShown, parent.BL_ID, data, parent.casesOption)

   //Create an Array of Graphs to show
  arrTopCounty.forEach((county) => {
    arrCounties.push(county.LK)
    parent.arrID.push(county.LK_ID)
    let infectionVal = -1
    switch (parent.casesOption) {
      case 'cases':
        infectionVal = county.cases_LK
        break
      case 'cases7_per_100k':
        infectionVal = Math.round(county.cases7_per_100k_LK * hundred) / hundred
        break
      default:
        infectionVal = Math.round(county.cases_per_100k_LK * hundred) / hundred
    }
    arrCases.push(infectionVal)
    //TODO: Make fillcolor nice and only assign once
    backgroundColor.push(parent.baseColor)
  })

  //Label all shown Graphs correctly
  parent.allCasesOptions.forEach((option) => {
    if (option.code === parent.casesOption) {
      label = option.label
    }
  })

  //Finally renders all the shown Graphes based on user settings
  parent.renderChart(
    {
      labels: arrCounties,
      datasets: [
        {
          label: label,
          backgroundColor: backgroundColor,
          data: arrCases,
        },
      ],
    },
    chartOptions
  )
}

</script>
