<script>
import {HorizontalBar} from 'vue-chartjs'

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
      selectedData: []
    }),
  watch: { 
    BLID: function() {
      drawChart(this)
    },
    graphsShown: function(){
      //console.log("Update graphs shown")
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
    const data = require('../../../../Backend/example_response.json')
    let arrCounties = []
    let arrCases = []
    let arrTopCounty = []
    //console.log(data.states)
    parent.arrID = []
    
    //let states1 = 1


    //arrTopCounty = selectTopCounty(this.topXCountys, this.states, this.infectionData)
    arrTopCounty = selectTopCounty(parent.graphsShown, parent.BLID, data)

    arrTopCounty.forEach (county => {

      //console.log(county)

      arrCounties.push(county.LK)
      arrCases.push(county.cases_per_100k_LK)
      parent.arrID.push(county.LK_ID)
      //console.log(arrCounties)
      //console.log(arrCases)
    })

    parent.renderChart ({
      labels: arrCounties,
      datasets: [{
        label: "Total 100k",
        backgroundColor: ['#00ff00', '#ff8fff', '#ff00ff'],
        data: arrCases
      }]
    },chartOptions)
}

 function selectTopCounty (topXCountys, states, infectionData) {
    //let topXCountys = 5
    let arrTopCountys = []
    const countys = selectCounty(states, infectionData)

    if(topXCountys > countys.length) topXCountys = countys.length

    for (let i = 0; i < topXCountys; i++){
      arrTopCountys.push(countys[i])
    }
    return arrTopCountys
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
      let sortedSelectetCounty = selectetCounty.slice(0);
      sortedSelectetCounty.sort(function(a,b) {
          return a.cases_per_100k_LK - b.cases_per_100k_LK;
      });
      return sortedSelectetCounty.reverse()
  }
</script>