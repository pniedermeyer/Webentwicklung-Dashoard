<template>
  <div selectedBL_ID="app">
    <h1>Corona Dashboard</h1>
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          1 of 3:
          <NumberInput v-bind:graphsShown="graphsShown" v-on:updateGraphsShown="updateGraphsShown"></NumberInput>
          <bar-chart
            :infectionData="infectionData"
            v-bind:BLID="selectedBL_ID"
            v-bind:graphsShown="graphsShown"
            v-on:updateSelectedLK="updateSelectedLK"
          ></bar-chart>
        </b-col>
        <b-col>
          2 of 3
          <MapSVG v-bind:BLID="selectedBL_ID" v-bind:LKID="selectedLK_ID"></MapSVG>
        </b-col>
        <b-col>
          3 of 3
            <TableComponent :infectionData="infectionData"/>
          <GlobalOptions
            :infectionData="infectionData"
            v-bind:selectedBLID="selectedBL_ID"
            v-bind:selectedLKID="selectedLK_ID"
            v-on:updateSelectedBL="updateSelectedBL"
            v-on:updateSelectedLK="updateSelectedLK"
          ></GlobalOptions>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NumberInput from './components/SelectBarsCount.vue'
import TableComponent from './components/TableComponent.vue'
import BarChart from "./components/BarchartTest.vue"
import MapSVG from "./components/MapSVG.vue"
import GlobalOptions from "./components/GlobalOptions.vue"
import axios from "axios"

export default {
  name: "App",
  components: {
    BarChart,
    MapSVG,
    NumberInput,
    TableComponent,
    GlobalOptions
  },
  data() {
    return {
      infectionData: require("../../../Backend/example_response.json"),
      selectedBL_ID: 3,
      selectedLK_ID: 0,
      graphsShown: 5
    };
  },
  methods: {
    updateSelectedBL(event) {
      this.selectedBL_ID = event;
      this.selectedLK_ID = null;
    },
    updateSelectedLK(event) {
      this.selectedLK_ID = event;
    },
    updateGraphsShown(event) {
      //console.log("Update Graphs shown: "+event)
      this.graphsShown = event;
    },
  },
  mounted () {
    var self = this
    axios
      .get('http://localhost:3001/data/')
      .then(response => (self.infectionData = response.data))
  }
  
};
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

.svg_element_primary_color_scheme {
  fill: teal;
  stroke: black;
  stroke-width: 0.05pt;
}
</style>
