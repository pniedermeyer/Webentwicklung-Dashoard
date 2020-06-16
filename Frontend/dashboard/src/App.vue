<template>
  <div selectedBL_ID="app">
    <b-container class="bv-example-row">
      <b-row>
        <b-col>1 of 3: 
          <bar-chart :infectionData="data" v-bind:BLID="selectedBL_ID"></bar-chart>
        </b-col>
        <b-col>2 of 3
            <MapSVG> </MapSVG>
        </b-col>
        <b-col>1 of 3
            <SelectComponent :data="data" :selectedID="selectedBL_ID" v-on:updateSelectedBL="updateSelectedBL"></SelectComponent>
            <SelectLK :data="data" v-bind:selectedBLID="selectedBL_ID" v-bind:selectedLKID="selectedLK_ID" v-on:updateSelectedBL="updateSelectedBL"></SelectLK>
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

//import axios from 'axios'

export default {
  name: 'App',
  components: {
    BarChart,
    MapSVG,
    SelectComponent,
    SelectLK
  },
  data () {
    return {
      //test: "HIPASCAL",
      data: require('../../../Backend/example_response.json'),
      selectedBL_ID: 3,
      selectedLK_ID: 0
    }
  },
  methods:{
    updateSelectedBL(event){
      console.log("old selectedBL_ID" + this.selectedBL_ID)
      console.log(event)
      this.selectedBL_ID = event;
    }
  }
  // async getData (){
  //   const { geoData } = await axios.get('http://localhost:8080/geo-data/')
  //   //const {   } = await axios.get('http://localhost:8080/data/')
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
