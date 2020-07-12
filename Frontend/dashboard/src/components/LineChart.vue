<script>
import { Line } from 'vue-chartjs'
import { mapFields } from 'vuex-map-fields'
export default {
  extends: Line,
  name: "linechart",
  data: () => ({ 
  }),
  props: {
    data: Array,
    label:String,
    labelShown: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    drawLineChart(this) 
    getDateLabels(15)
  },
  methods: {
    handle: function() {
      // this.lineChartDialogConfig = 'GEÄNDERT'
      this.$emit('lineclick', this)
    }

  },
  computed: {
    ...mapFields({
      casesOption: 'casesOption',
      infectionData: 'infectionData',
      lastXDays: 'lastXDays',
      lineChartDialogConfig: 'lineChartDialogConfig'      
    })
    },
  watch: {
    data: function(){
      drawLineChart(this)
    },
    label: function(){
      drawLineChart(this)
    },
  },
}

function drawLineChart(parent){
  const chartOptions = {
    showLines: true,
    spanGaps: true,
    legend: {
      display: parent.labelShown
    },
    onClick: parent.handle
  }
/*   const lastXData = {
    } */
  //const chartData = parent.infectionData
  // const testDaten = [5,10,7,4]
  //const testDaten2 = [3,8,2,1]
  // console.log(parent)

  // lastXData = selectLastXData(parent.data, parent.lastXData)

    parent.renderChart(
    {
      labels: getDateLabels(5),
      datasets: [
        {
          label: parent.label, //Aus den Props
          type: 'line',
          data: parent.data, //Array gefiltert aus den Props
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
        } /** ,
        {
          label: 'Neue Fälle 2',
          type: 'line',
          data: testDaten2,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
        },**/
      ],
    },
    chartOptions
  )
}
// function selectLastXData (data, lastXData) {
//   let tempData = {
//     caseData: [],
//     days: []
//   }
  
//   for (let i = 0; i < lastXData; i++) {
//     tempData.caseData.push(data[i])
//     tempData.days.push()
//   }
// }

function getDateLabels(lastXData) {

  let dateArray = []
  let dateToPush 
  for(let i =lastXData; i>=0; i-- ) {
    //dateArray.push(currentDate.getDate()-i)
    dateToPush = new Date()
    dateToPush.setDate(new Date().getDate()-i)
    // dateArray.push(new Date(dateToPush))
    dateArray.push(dateToPush.getDate() + '. ' + dateToPush.toLocaleString('default', { month: 'short'}))

    // console.log(dateToPush)
  }
  //console.log(dateArray)
  return dateArray
}
</script>