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
          <MapSVG
                  v-bind:selectedBL_ID="selectedBL_ID"
                  v-bind:selectedLK_ID="selectedLK_ID"
                  v-bind:infectionData="infectionData"
                  v-bind:selectedCaseOption="selectedCaseOption"
                  v-bind:baseColor="baseColor"
          ></MapSVG>
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
import { mapFields } from 'vuex-map-fields';
import vuexStore from './store/index.js';

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
  computed: {
    ...mapFields([
      'graphsShown',
      'selectedBL_ID',
      'selectedLK_ID',
      'selectedCaseOptions',
      'selectedItemsID',
      'tab'
    ])
  },
  watch: {
    graphsShown: function() {
      updateUserUrl({graphsShown: this.graphsShown})
    },
    selectedBL_ID: function() {
      updateUserUrl({selectedBL_ID: this.selectedBL_ID})
    },
    selectedLK_ID: function() {
      updateUserUrl({selectedLK_ID: this.selectedLK_ID})
    },
    selectedCaseOptions: function() {
      updateUserUrl({selectedCaseOptions: this.selectedCaseOptions})
    },
    selectedItemsID: function() {
      updateUserUrl({selectedItemsID: this.selectedItemsID})
    },
    tab: function() {
      updateUserUrl({tab: this.tab})
    },
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
    /*     updateSelectedBL(event) {
      this.selectedBL_ID = event;
      this.selectedLK_ID = 0;
      console.log(this.baseColor)
      this.updateUserUrl()
    },
    updateSelectedLK(event) {
      this.selectedLK_ID = event
      this.updateUserUrl()
    },
    updateGraphsShown(event) {
      this.graphsShown = event
      this.sendUserData()
      this.updateUserUrl()
    },
    updateCaseOptions(event) {
      //this.selectedCaseOptions = event
      this.updateUserUrl()
    },
    updateMapZoomLevel() {
      //this.map_resolution = event;
      this.updateUserUrl()
    },
    updateMapQualityLevel(event) {
      this.map_quality = event;
      this.updateUserUrl()
    }, */
    sendUserData(){
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
    }
  },
  mounted() {
    let self = this
    urlToSettingsChange(parseUrlState(window.location))
    axios.get('http://localhost:3001/data/').then((response) => (self.infectionData = response.data))
  },
  created() {
    /**

      window.addEventListener('beforeunload', (event) => {
        // Cancel the event as stated by the standard.
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = 'TEST';

        console.log("TRY TO CLOSE")

        //Hier gespeicherte Sachen versenden!
      });*/

    /**
     * Adds an event listener for the "popstate" event, indicating the use of the navigation buttons
     * in the browser or
     */
    window.addEventListener('popstate', function(event) {
      urlToSettingsChange(
              parseUrlState(event.currentTarget.location)
      )
    });
  }
  
};

/**
 * Updates the URL in the browser, so that it contains the current configuration of the webapp
 * This will also update the history-object, so that the user can undo a change by clicking on the back button
 * The configuration will be stored in the "hash" part of the URL, so that it is shareable
 * @param dataChangeSet A key-value object that contains fields which should be updated
 */
function updateUserUrl(dataChangeSet) {
  let userData = parseUrlState(window.location)
  if (!(userData)) {
    //TODO: Access this from store/index.js instead of copying it here!
    userData = {
      graphsShown: 5,
      selectedBL_ID: 0,
      selectedLK_ID: 0,
      selectedCaseOptions: 'cases7_per_100k',
      selectedItemsID: [[2, 6], [], [0, 20, 40]],
      tab: 0
    };
  }

  for (let changedFieldName of Object.keys(dataChangeSet)) {
    console.log(changedFieldName + " is now " + dataChangeSet[changedFieldName])
    userData[changedFieldName] = dataChangeSet[changedFieldName];
  }

  window.history.pushState(userData, "_THIS_IS_NOT_USED_CURRENTLY_", "#"+JSON.stringify(userData))
}

/**
 * Updates the URL in the browser, so that it contains the current configuration of the webapp
 */
function urlToSettingsChange(settings) {
  if (!(settings)) {
    return
  }

  console.log("Deserializing settings from URL to vuex state: "+JSON.stringify(settings))
  vuexStore.commit('setFields', settings)
}

function parseUrlState(url) {
  try {
    var userState = decodeURIComponent(url.hash.substring(1))
    return JSON.parse(userState)
  } catch (e) {
    console.warn("Could not parse JSon from URL: ", e)
    return null
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

.svg_element_primary_color_scheme {
  stroke: black;
  stroke-width: 0.05pt;
}
</style>
