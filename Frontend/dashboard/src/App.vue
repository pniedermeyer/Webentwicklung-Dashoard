<template>
  <div id="app">
    <b-container class="bv-example-row">
      <b-row>
        <b-col>1 of 3: 
          <bar-chart :test="test"></bar-chart>
        </b-col>
        <b-col>2 of 3
            <MapSVG> </MapSVG>
        </b-col>
        <b-col>3 of 3
        </b-col>
      </b-row>
    </b-container>
  </div> 
</template>

<script>
import BarChart from './components/BarchartTest.vue'
import MapSVG from './components/MapSVG.vue'

export default {
  name: 'App',
  components: {
    BarChart,
    MapSVG
  },
  data () {
    return {
      test: "HIPASCAL"
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
