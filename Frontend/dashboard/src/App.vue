<template>
  <!-- <div selectedBL_ID="app"> -->
  <v-app>
    <app-bar />
    <v-main class="mh-100">
      <div class="mapcon d-flex w-100 h-100">
        <Map ref="Map" />
        <!-- <global-options /> -->
      </div>
      <LineChartPopUp />
      <v-row>
        <v-col
          v-show="visibleComponents.barchartvisible"
          cols="12"
          lg="6"
          v-bind:class="{'col-lg-12': visibleComponents.lineChartVisible && !visibleComponents.casesGermanyVisible || !visibleComponents.lineChartVisible && !visibleComponents.casesGermanyVisibl && !visibleComponents.casesStateVisible && !visibleComponents.casesCountyVisible}"
        >
          <v-card class="ma-2">
            <v-app-bar color="blue darken-2" dark dense>
              <v-spacer></v-spacer>
              <v-toolbar-title class="w-100">
                Barchart
                <v-icon color="white">mdi-chart-bar</v-icon>
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-app-bar>
            <bar-chart />
          </v-card>
        </v-col>
        <v-col
          v-show="visibleComponents.lineChartVisible && visibleComponents.casesGermanyVisible || !visibleComponents.lineChartVisible  && (visibleComponents.casesGermanyVisibl || visibleComponents.casesStateVisible || visibleComponents.casesCountyVisible)"
          cols="12"
          lg="6"
          v-bind:class="{'col-lg-12': !visibleComponents.barchartvisible}"
        >
          <Details v-show="visibleComponents.lineChartVisible" :view="0" />
          <div v-show="!visibleComponents.lineChartVisible">
            <v-row v-show="visibleComponents.casesGermanyVisible">
              <v-col class="pt-0" style="padding-bottom: 1.7rem;">
                <Details :view="0" />
              </v-col>
            </v-row>
            <v-row v-show="visibleComponents.casesStateVisible">
              <v-col class="pt-0" style="padding-bottom: 1.7rem;">
                <Details :view="1" />
              </v-col>
            </v-row>
            <v-row v-show="visibleComponents.casesCountyVisible">
              <v-col class="pt-0">
                <Details :view="2" />
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-show="visibleComponents.casesStateVisible"
          cols="12"
          lg="6"
          v-bind:class="{'col-lg-12': !visibleComponents.casesCountyVisible}"
        >
          <Details v-show="visibleComponents.lineChartVisible" :view="1" />
        </v-col>
        <v-col
          v-show="visibleComponents.casesCountyVisible"
          cols="12"
          lg="6"
          v-bind:class="{'col-lg-12': !visibleComponents.casesStateVisible}"
        >
          <Details v-show="visibleComponents.lineChartVisible" :view="2" />
        </v-col>
      </v-row>
    </v-main>

    <v-footer>
      <div class="my-2">
        <v-btn text small href="https://www.htwsaar.de/htw/impressum" target="_blank">Impressum</v-btn>
      </div>
      <div class="my-2">
        <v-btn
          text
          small
          href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0"
          target="_blank"
        >Datenquelle</v-btn>
      </div>
      <div class="my-2">
        <v-btn text small href="https://www.govdata.de/dl-de/by-2-0" target="_blank">Datenlizenz</v-btn>
      </div>
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
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
import store from "./store/dataStore.js";

import {
  registerURLEventListener,
  storeListener
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
      mapPosition: "mapPosition",
      infectionData: "infectionData",
      visibleComponents: "visibleComponents",
      pastInfectionData: "pastInfectionData",
      casesGermanyVisible: "casesGermanyVisible",
      casesStateVisible: "casesStateVisible",
      casesCountyVisible: "casesCountyVisible",
      mapVisible: "mapVisible",
      barchartvisible: "barchartvisible"
      // baseColor : 'baseColor',
      // tableSelectedItemsID : 'tableSelectedItemsID',
      // tableTab : 'tableTab',
      // barsShown : 'barsShown',
      // mapZoom : 'mapZoom',
      // mapPosition : 'mapPosition',
      // mapResolution : 'mapResolution'
    })
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.$refs.Map.setBrowserLocation([
              position.coords.latitude,
              position.coords.longitude
            ]);
          },
          error => {
            console.log(error.message);
          }
        );
      }
    }
  },

  mounted() {
    let self = this;
    //urlToSettingsChange(parseUrlState(window.location));
    axios
      .get("http://localhost:3001/data?numberOfPreviousDays=14")
      .then(response => {
        self.infectionData = response.data[0];
        self.pastInfectionData = response.data;
      });

    store.subscribe(storeListener);
    this.getLocation();
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

.mapcon {
  height: auto !important;
}

.overviewconf {
  overflow: auto;
  width: 60vw !important;
  max-height: 70vh !important;
  max-width: 60vw !important;
}

.compWidth100 {
  max-width: 100% !important;
  flex: 0 0 100% !important;
}

.barchart {
  margin: 1vh;
  width: 100%;
  width: -moz-available; /* WebKit-based browsers will ignore this. */
  width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  width: fill-available;
  max-width: 40vw;
}
.vcardoverview {
  margin: 1vh;
}

.svg_element_primary_color_scheme {
  stroke: black;
  stroke-width: 0.05pt;
}
.barchartconf {
  margin: 1vh !important;
}
</style>
