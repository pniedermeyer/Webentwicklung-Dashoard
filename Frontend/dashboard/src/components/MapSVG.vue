<template>
  <div>
    <div>
      <div>
        <!-- resolution -->
        <label for="resolution">🗺️Auflösung:</label>
        <select v-model="resolution" v-on:change="resolutionChanged()">
          <option disabled value>Bitte wählen Sie</option>
          <option v-for="res in resolutions" v-bind:value="res.value" v-bind:key="res.value">{{ res.text }}</option>
        </select>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import axios from 'axios'
import leafletManager from './leafletManager'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'MapSVG',
  data() {
    return {
      geoData: null,
      lfltMng: null,
      resolution: 0,
      resolutions: [
        { text: 'Niedrig', value: 2 },
        { text: 'Mittel', value: 1 },
        { text: 'Hoch', value: 0 },
      ],
      selectedBL: null,
      selectedLK: null,
      minCases: 0,
      maxCases: 0,
    }
  },
  props: {
    infectionData: Object,
    baseColor: Number,
  },
  computed: {
    ...mapFields(['selectedBL_ID', 'selectedCaseOptions', 'selectedLK_ID']),
  },
  watch: {
    selectedBL_ID: function() {},
    selectedLK_ID: function() {},
    infectionData: function() {
      this.lfltMng.setInfectionData(this.infectionData)
    },
    selectedCaseOptions: function() {
      this.lfltMng.setMapStyle(this.selectedCaseOptions)
    },
    baseColor: function() {},
    geoData: function() {
      this.lfltMng.setGeoData(this.geoData)
      this.lfltMng.addMapLayer()
      this.lfltMng.setMapStyle(this.selectedCaseOptions)
    },
  },
  methods: {
    fetchGeoData(res = 0) {
      let that = this
      let url = `http://localhost:3001/geodata?` + 'res=' + res
      axios
        .get(url)
        .then(function(response) {
          that.geoData = response.data
          console.log('Fetch geodata succeeded', response)
        })
        .catch(function(error) {
          console.log('Fetch geodata failed:', error)
        })
    },
    zoomLevelChanged() {},
    resolutionChanged() {
      this.fetchGeoData(this.resolution)
    },
  },
  created() {},
  mounted() {
    this.lfltMng = new leafletManager('map')
    this.lfltMng.initializeMap()
    this.fetchGeoData()
  },
}
</script>

<style>
@import '../../node_modules/leaflet/dist/leaflet.css';
#map {
  height: 400px;
}
</style>
