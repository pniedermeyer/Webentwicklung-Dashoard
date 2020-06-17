<script>
import {HorizontalBar} from 'vue-chartjs'

export default {
  extends: HorizontalBar,
  name: 'barchart',
  props: {
    test: {
      type: String
      },
/*     infectionData: {
      type: Object
    },
    topXCountys: {
      type: Number
    },
    states: {
      type: String
    }, */
    BLID: {
      type: Number
    },
  },

/* render(){
  console.log("ID in Barchart" + this.id)
  return ""
}, */

  mounted () {
    drawChart(this)
  },
  watch: { 
    BLID: function() {
      drawChart(this)
    }
  }

}
//END EXPORT

function drawChart(parent){
        console.log(parent.test);
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

// TODO: Erstzen mit request
    const data = require('../../../../Backend/example_response.json')
    let arrCounties = []
    let arrCases = []
    let arrTopCounty = []
    console.log(data.states)
    
    //let states1 = 1
    let topXCountys1 = 3


    //arrTopCounty = selectTopCounty(this.topXCountys, this.states, this.infectionData)
    arrTopCounty = selectTopCounty(topXCountys1, parent.BLID, data)

    arrTopCounty.forEach (county => {

      console.log(county)

      arrCounties.push(county.LK)
      arrCases.push(county.cases_per_100k_LK)
      console.log(arrCounties)
      console.log(arrCases)
    })

    parent.renderChart ({
      labels: arrCounties,
      datasets: [{
        label: "Total 100k",
        backgroundColor: '#00ff00',
        data: arrCases
      }]
    },chartOptions)
}

 function selectTopCounty (topXCountys, states, infectionData) {
    //let topXCountys = 5
    let arrTopCountys = []
    const countys = selectCounty(states, infectionData)
    for (let i = 0; i < topXCountys; i++){
      arrTopCountys.push(countys[i])
    }
    return arrTopCountys
  }

function compare(a, b) {
  const countyA = a.cases_per_100k_LK;
  const countyB = b.cases_per_100k_LK;

  let comparison = 0;
  if (countyA > countyB) {
    comparison = 1;
  } else if (countyA < countyB) {
    comparison = -1;
  }
  return comparison;
}

  function selectCounty (states, infectionData) {
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
    selectetCounty.sort(compare).reverse()
    return selectetCounty
  }
</script>