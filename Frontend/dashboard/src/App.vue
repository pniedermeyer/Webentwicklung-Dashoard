<template>
  <div id="app">
    <b-container class="bv-example-row">
      <b-row>
        <b-col>1 of 3: 
          <bar-chart :chartData="arrTotal" :options="chartOptions" :label="Test"></bar-chart>
        </b-col>
        <b-col>2 of 3</b-col>
        <b-col>3 of 3</b-col>
      </b-row>
    </b-container>
  </div> 
</template>

<script>
import BarChart from './components/BarchartTest.vue'


export default {
  name: 'App',
  components: {
    BarChart
  },
  data () {
    return {
      Test: 'Cases100k',
      arrTotal: [10,15,20],
      arrCounty: ['Saarbrücken', 'Saarlouise', 'Merzig'],
      chartOptions: {
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
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
