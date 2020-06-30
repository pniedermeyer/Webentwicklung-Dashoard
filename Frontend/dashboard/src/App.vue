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
            v-bind:caseOptions='caseOptions'
            v-bind:selectedCaseOption="selectedCaseOptions"
            v-bind:baseColor="baseColor"
          ></bar-chart>
        </b-col>
        <b-col>
          2 of 3
          <MapSVG 
            v-bind:BLID="selectedBL_ID" 
            v-bind:LKID="selectedLK_ID" 
            v-bind:baseColor="baseColor"></MapSVG>
        </b-col>
        <b-col>
          3 of 3
          <GlobalOptions
            :infectionData="infectionData"
            v-bind:selectedBLID="selectedBL_ID"
            v-bind:selectedLKID="selectedLK_ID"
            v-bind:selectedCaseOption="selectedCaseOptions"
            v-bind:caseOptions="caseOptions"
            v-on:updateSelectedBL="updateSelectedBL"
            v-on:updateSelectedLK="updateSelectedLK"
            v-on:updateCaseOptions="updateCaseOptions">
          </GlobalOptions>
          <TableComponent 
            :infectionData="infectionData"
            v-bind:selectedBLID="selectedBL_ID"
            v-bind:selectedLKID="selectedLK_ID"/>
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
import sendUserData from "./functions/sendUserData.js"

//So gelöst, falls mal die Sprache gewechselt werden muss
const caseOptions =  [
        { label: "Alle Fälle", code: "cases"},
        { label: "Fälle / 100k", code: "cases_per_100k" },
        { label: "Fälle / 100k letzte 7 Tage", code: "cases7_per_100k"},
      ]

const baseColor = 120

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
      selectedBL_ID: 0,
      selectedLK_ID: 0,
      graphsShown: 5,
      selectedCaseOptions: "cases7_per_100k",
      caseOptions: caseOptions,
      baseColor: baseColor
    };
  },
  methods: {
    updateSelectedBL(event) {
      this.selectedBL_ID = event;
      this.selectedLK_ID = 0;
      console.log(this.baseColor)
    },
    updateSelectedLK(event) {
      this.selectedLK_ID = event
    },
    updateGraphsShown(event) {
      this.graphsShown = event;
      this.sendUserData();
    },
    updateCaseOptions(event) {
      this.selectedCaseOptions = event
    },
    sendUserData(){
      sendUserData(
        "sdoifn",
        this.selectedBL_ID,
        this.selectedLK_ID,
        this.selectedCaseOptions,
        "Mapresolution",
        "zoom",
        this.graphsShown,
        "selectedTab",
        "viewDetails"
      )
    }
  },
  mounted () {
    let self = this
    axios
      .get('http://localhost:3001/data/')
      .then(response => (self.infectionData = response.data))
  },
  created() {
        window.addEventListener('beforeunload', (event) => {
        // Cancel the event as stated by the standard.
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = 'TEST';

        console.log("TRY TO CLOSE")

        //Hier gespeicherte Sachen versenden!
      });
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
  stroke: black;
  stroke-width: 0.05pt;
}
</style>
