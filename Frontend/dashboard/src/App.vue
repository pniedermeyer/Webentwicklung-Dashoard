<template>
  <!-- <div selectedBL_ID="app"> -->
  <v-app>
    <app-bar />
    <div class="d-flex w-100 h-100">
      <Map />
      <!-- <global-options /> -->
    </div>
    <LineChartPopUp />
    <div class="d-flex flex-row">
      <div class="d-flex flex-column w-50">
        <Details :view="0" />
        <Details :view="1" />
        <Details :view="2" />
      </div>
      <div class="d-flex flex-column">
        <bar-chart />
        <div>
          <span>Line Chart Filler</span>
          <!-- <number-input /> -->
        </div>
      </div>
    </div>
    <!-- <b-container class="bv-example-row">
        <b-row>
          <b-col>
            1 of 3:
            <number-input />
            <bar-chart></bar-chart>
          </b-col>
          <b-col>
            2 of 3
            <Map></Map>
          </b-col>
          <b-col>
            3 of 3
            <GlobalOptions></GlobalOptions>
            <Details :view="0" />
            <Details :view="1" />
            <Details :view="2" />
          </b-col>
        </b-row>
    </b-container>-->
  </v-app>
  <!-- </div> -->
</template>

<script>
import AppBar from "./components/AppBar.vue";
//import NumberInput from "./components/SelectBarsCount.vue";
// import TableComponent from "./components/TableComponent.vue";
import Details from "./components/Details.vue";
import BarChart from "./components/Barchart.vue";
import Map from "./components/Map.vue";
import LineChartPopUp from "./components/LineChartPopUp.vue";
// import GlobalOptions from "./components/GlobalOptions.vue";
import axios from "axios";
import { mapFields } from "vuex-map-fields";

import {
  registerURLEventListener,
  parseUrlState,
  urlToSettingsChange
} from "./functions/UrlSettings.js";

export default {
  name: "App",
  components: {
    AppBar,
    BarChart,
    Map,
    // NumberInput,
    LineChartPopUp,
    // TableComponent,
    Details
    // GlobalOptions
  },
  computed: {
    // TODO: remove unused fields for production
    ...mapFields({
      BL_ID: "BL_ID",
      // LK_ID : 'LK_ID',
      // casesOption : 'casesOption',
      // allCasesOptions : 'allCasesOptions',
      infectionData: "infectionData"
      // baseColor : 'baseColor',
      // tableSelectedItemsID : 'tableSelectedItemsID',
      // tableTab : 'tableTab',
      // barsShown : 'barsShown',
      // mapZoom : 'mapZoom',
      // mapPosition : 'mapPosition',
      // mapResolution : 'mapResolution'
    })
  },

  mounted() {
    let self = this;
    urlToSettingsChange(parseUrlState(window.location));
    axios
      .get("http://localhost:3001/data?numberOfPreviousDays=14")
      .then(response => {
        self.infectionData = response.data;
        console.log(self.infectionData);
      });
  },
  created() {
    registerURLEventListener();
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
  /* margin-top: 60px; */
}

.svg_element_primary_color_scheme {
  stroke: black;
  stroke-width: 0.05pt;
}
</style>
