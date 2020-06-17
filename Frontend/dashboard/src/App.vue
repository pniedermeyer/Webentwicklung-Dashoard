<template>
  <div selectedBL_ID="app">
    <b-container class="bv-example-row">
      <b-row>
        <b-col>1 of 3: 
          <NumberInput v-bind:graphsShown="graphsShown" v-on:updateGraphsShown="updateGraphsShown"></NumberInput>
          <bar-chart :infectionData="data" v-bind:BLID="selectedBL_ID" v-bind:graphsShown="graphsShown" v-on:updateSelectedLK="updateSelectedLK"></bar-chart>
        </b-col>
        <b-col>2 of 3
            <MapSVG v-bind:BLID="selectedBL_ID" v-bind:LKID="selectedLK_ID"> </MapSVG>
        </b-col>
        <b-col>3 of 3
            <SelectComponent :data="data" v-bind:selectedID="selectedBL_ID" v-on:updateSelectedBL="updateSelectedBL"></SelectComponent>
            <SelectLK :data="data" v-bind:selectedBLID="selectedBL_ID" v-bind:selectedLKID="selectedLK_ID" v-on:updateSelectedLK="updateSelectedLK"></SelectLK>
        </b-col>
      </b-row>
    </b-container>
  </div> 
</template>

<script>
import BarChart from './components/BarchartTest.vue'
import MapSVG from './components/MapSVG.vue'
import SelectComponent from './components/SelectComponent.vue'
import SelectLK from './components/SelectLK.vue'
import NumberInput from './components/SelectTopCountys.vue'


export default {
  name: 'App',
  components: {
    BarChart,
    MapSVG,
    SelectComponent,
    SelectLK,
    NumberInput
  },
  data () {
    return {
      data: require('../../../Backend/example_response.json'),
      selectedBL_ID: 3,
      selectedLK_ID: 0,
      graphsShown: 5
    }
  },
  methods:{
    updateSelectedBL(event){
      this.selectedBL_ID = event
      this.selectedLK_ID = null
    },
    updateSelectedLK(event){
      this.selectedLK_ID = event
    },
    updateGraphsShown(event) {
      //console.log("Update Graphs shown: "+event)
      this.graphsShown = event
    }
  }
  // async getData (){
  //   const { geoData } = await axios.get('http://localhost:8080/geo-data/')
  //   //const { data } = await axios.get('http://localhost:8080/data/')
  //   console.log(geoData)
  // }
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
