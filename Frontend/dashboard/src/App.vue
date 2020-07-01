<template>
  <div selectedBL_ID="app">
    <h1>Corona Dashboard</h1>
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          1 of 3:
          <NumberInput></NumberInput>
          <bar-chart :infectionData="infectionData" v-bind:baseColor="baseColor" :caseOptions="caseOptions"></bar-chart>
        </b-col>
        <b-col>
          2 of 3
          <MapSVG v-bind:infectionData="infectionData" v-bind:baseColor="baseColor"></MapSVG>
        </b-col>
        <b-col>
          3 of 3
          <GlobalOptions v-bind:infectionData="infectionData" :caseOptions="caseOptions"> </GlobalOptions>
          <TableComponent :infectionData="infectionData" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NumberInput from './components/SelectBarsCount.vue'
import TableComponent from './components/TableComponent.vue'
import BarChart from './components/Barchart.vue'
import MapSVG from './components/MapSVG.vue'
import GlobalOptions from './components/GlobalOptions.vue'
import axios from 'axios'
import sendUserData from './functions/sendUserData.js'

//So gelöst, falls mal die Sprache gewechselt werden muss
const caseOptions = [
  { label: 'Alle Fälle', code: 'cases' },
  { label: 'Fälle / 100k', code: 'cases_per_100k' },
  { label: 'Fälle / 100k letzte 7 Tage', code: 'cases7_per_100k' },
]

const baseColor = 120

export default {
  name: 'App',
  components: {
    BarChart,
    MapSVG,
    NumberInput,
    TableComponent,
    GlobalOptions,
  },
  data() {
    return {
      infectionData: require('../../../Backend/example_response.json'),
      selectedCaseOption: 'cases7_per_100k',
      caseOptions: caseOptions,
      baseColor: baseColor,
    }
  },
  methods: {
    sendUserData() {
      sendUserData(
        'sdoifn',
        /*         this.selectedBL_ID,
        this.selectedLK_ID,
        this.selectedCaseOptions, */
        'Mapresolution',
        'zoom',
        // this.graphsShown,
        'selectedTab',
        'viewDetails'
      )
    },
  },
  mounted() {
    let self = this
    axios.get('http://localhost:3001/data/').then((response) => (self.infectionData = response.data))
  },
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
