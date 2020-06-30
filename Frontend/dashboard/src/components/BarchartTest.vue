<script>
import {HorizontalBar} from 'vue-chartjs'
import {calcFillcolor} from '../functions/calcFillcolor'

export default {
  extends: HorizontalBar,
  name: 'barchart',
  props: {
    graphsShown: {
      type: Number
    },
    BLID: {
      type: Number
    },
    infectionData: {
      type: Object
    },
    selectedCaseOption: {
      type: String
    },
    caseOptions: {
      type: Array
    },
    baseColor: Number,
  },

/* render(){
  console.log("ID in Barchart" + this.id)
  return ""
}, */

  mounted () {
    drawChart(this)
  },
  methods: {
    handle (point, event) {
      event[0]? this.$emit('updateSelectedLK', this.arrID[event[0]._index]):""
    }
  },
  data: () => ({
      arrID: [],
      selectedData: [],
      maxCases: {
        maxCasesLk: -1,
        maxCasesPer100kLk: -1,
        max7CasesPer100kLk: -1
      } 
    }),
  watch: { 
    BLID: function() {
      drawChart(this)
    },
    graphsShown: function(){
      //console.log("Update graphs shown")
      drawChart(this)
    },
    infectionData: function(){
      evaluateMaxData(this)
      drawChart(this)
    },
    selectedCaseOption: function(){
      console.log(this.selectedCaseOption)
      drawChart(this)
    }
  }
}
//END EXPORT

function drawChart(parent){
  //console.log(parent.graphsShown)
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
        onClick:parent.handle
      }

    // TODO: Erstzen mit request
    const data = parent.infectionData
    let arrCounties = []
    let arrCases = []
    let arrTopCounty = []
    let backgroundColor = []
    let label = ''
    const hundred = 100
    //console.log(data.states)
    parent.arrID = []

    // assign max value
    let maxInfectionval
    switch(parent.selectedCaseOption){
      case 'cases':
        maxInfectionval = parent.maxCases.maxCasesLk
        break;
      case 'cases7_per_100k':
        maxInfectionval = parent.maxCases.max7CasesPer100kLk
        break;
      default:
        maxInfectionval = parent.maxCases.maxCasesPer100kLk
    }

    //arrTopCounty = selectTopCounty(this.topXCountys, this.states, this.infectionData)
    arrTopCounty = selectTopCounty(parent.graphsShown, parent.BLID, data, parent.selectedCaseOption)

    arrTopCounty.forEach (county => {
      arrCounties.push(county.LK)
      parent.arrID.push(county.LK_ID)
      let infectionVal = -1
      switch(parent.selectedCaseOption){
        case 'cases':
          infectionVal = county.cases_LK
          break;
        case 'cases7_per_100k':
          infectionVal = Math.round(county.cases7_per_100k_LK * hundred) / hundred
          break;
        default:
          infectionVal = Math.round(county.cases_per_100k_LK * hundred) / hundred
      }
      arrCases.push(infectionVal)
      const fillCol = calcFillcolor({ baseColor: parent.baseColor, value: infectionVal, maxValue: maxInfectionval })
      backgroundColor.push(fillCol)
      //console.log(arrCounties)
      //console.log(arrCases)
    })

    parent.caseOptions.forEach(option => {
      if(option.code === parent.selectedCaseOption){
        label = option.label
      }
    })

    parent.renderChart ({
      labels: arrCounties,
      datasets: [{
        label: label,
        backgroundColor: backgroundColor,
        data: arrCases
      }]
    },chartOptions)
}

 function selectTopCounty (topXCountys, states, infectionData, caseOption) {
    //let topXCountys = 5
    let arrTopCountys = []
    console.log(caseOption)
    const countys = selectCounty(states, infectionData, caseOption)

    if(topXCountys > countys.length) topXCountys = countys.length

    for (let i = 0; i < topXCountys; i++){
      arrTopCountys.push(countys[i])
    }
    return arrTopCountys
  }

  function selectCounty (states, infectionData, caseOption) {
    console.log('Select:' + caseOption)
    let selectetCounty = []


    if (states === 0) {
      infectionData.states.forEach (state => {
          state.counties.forEach (county => {
            selectetCounty.push(county)
          })
        })
    } else {
      infectionData.states.forEach(state => {
        if (state.BL_ID === states) {
          state.counties.forEach (county => {
          selectetCounty.push(county)
        })
        }
      })
    }
      let sortedSelectetCounty = []
      switch(caseOption) {
        case 'cases':
          console.log("cases in switch")
          sortedSelectetCounty = selectetCounty.slice(0)
          sortedSelectetCounty.sort(function(a,b) {
            return a.cases_LK - b.cases_LK;
          });
          break;
        case 'cases7_per_100k':
          console.log("cases7 in switch")
          sortedSelectetCounty = selectetCounty.slice(0)
          sortedSelectetCounty.sort(function(a,b) {
            return a.cases7_per_100k_LK - b.cases7_per_100k_LK;
          });
          break;
      default:
        sortedSelectetCounty = selectetCounty.slice(0)
        sortedSelectetCounty.sort(function(a,b) {
          return a.cases_per_100k_LK - b.cases_per_100k_LK;
        });
      
    }
    return sortedSelectetCounty.reverse()
  }

  function evaluateMaxData(parent){
    parent.infectionData.states.forEach(state => {
      state.counties.forEach(county => {
        parent.maxCases.maxCasesLk = county.cases_LK > parent.maxCases.maxCasesLk ? county.cases_LK : parent.maxCases.maxCasesLk
        parent.maxCases.maxCasesPer100kLk = county.cases_per_100k_LK > parent.maxCases.maxCasesPer100kLk ? county.cases_per_100k_LK : parent.maxCases.maxCasesPer100kLk
        parent.maxCases.max7CasesPer100kLk = county.cases7_per_100k_LK > parent.maxCases.max7CasesPer100kLk ? county.cases7_per_100k_LK : parent.maxCases.max7CasesPer100kLk
      })
    })
  }
</script>