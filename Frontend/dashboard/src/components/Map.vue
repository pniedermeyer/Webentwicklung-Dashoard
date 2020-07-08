<template>
  <div class="w-100" id="map-container">
    <!-- resolution -->
    <!-- <label for="resol">🗺️ Auflösung:</label>
    <v-select
      v-model="mapResolution"
      label="text"
      :options="resolutions"
      :reduce="(item) => item.value"
      :clearable="false"
    ></v-select>-->
    <div id="map"></div>
    <global-options />
  </div>
</template>

<script>
import axios from "axios";
import leafletManager from "../functions/leafletManager";
import { mapFields } from "vuex-map-fields";
import GlobalOptions from "./GlobalOptions.vue";

export default {
  name: "Map",
  components: {
    GlobalOptions
  },
  data() {
    return {
      lfltMng: null,
      geoDatas: [],
      resolutions: [
        { text: "Niedrig", value: 2 },
        { text: "Mittel", value: 1 },
        { text: "Hoch", value: 0 }
      ],
      minCases: 0,
      maxCases: 0
    };
  },
  computed: {
    ...mapFields({
      BL_ID: "BL_ID",
      LK_ID: "LK_ID",
      casesOption: "casesOption",
      infectionData: "infectionData",
      baseColor: "baseColor",
      mapZoom: "mapZoom",
      mapPosition: "mapPosition",
      mapResolution: "mapResolution"
    })
  },
  watch: {
    BL_ID: function() {},
    LK_ID: function() {},
    infectionData: function() {
      this.lfltMng.setInfectionData(this.infectionData);
      // Ensures the style gets initialized
      this.lfltMng.setMapStyle(this.casesOption);
    },
    casesOption: function() {
      this.lfltMng.setMapStyle(this.casesOption);
    },
    baseColor: function() {
      this.lfltMng.fillColor(this.baseColor);
      this.lfltMng.setMapStyle(this.casesOption);
    },
    geoData: function() {
      this.lfltMng.setGeoData(this.geoData);
      this.lfltMng.setMapStyle(this.selectedCaseOptions);
    },
    mapZoom: function() {},
    mapPosition: {
      deep: true,
      handler() {
        //Function Call hier
        //TODO: Funktion testen, da Array
      }
    },
    mapResolution: {
      handler() {
        this.resolutionChanged();
      }
    }
  },
  methods: {
    fetchGeoData(res = 0) {
      let that = this;
      let url = `http://localhost:3001/geodata?` + "res=" + res;
      return axios
        .get(url)
        .then(function(response) {
          that.geoDatas[res] = response.data;
          console.log("Fetch geodata succeeded", response);
        })
        .catch(function(error) {
          console.log("Fetch geodata failed:", error);
        });
    },
    zoomLevelChanged() {},
    resolutionChanged() {
      const geoData = this.geoDatas[this.mapResolution];
      const that = this;
      if (!geoData) {
        // Work in Promise if resolution is currently not loaded
        this.fetchGeoData(this.mapResolution).then(function() {
          that.lfltMng.setGeoData(that.geoDatas[that.mapResolution]);
          that.lfltMng.setMapStyle(that.casesOption);
        });
      } else {
        this.lfltMng.setGeoData(geoData);
        this.lfltMng.setMapStyle(this.casesOption);
      }
    }
  },
  mounted() {
    this.lfltMng = new leafletManager("map");
    this.lfltMng.initializeMap({
      position: this.mapPosition,
      zoom: this.mapZoom
    });
    this.lfltMng.fillColor(this.baseColor);
    this.resolutionChanged();
  }
};
</script>

<style>
@import "../../node_modules/leaflet/dist/leaflet.css";
#map {
  height: 100%;
  /* height: 100%; */
}

#map-container {
  height: 600px;
  position: relative;
  z-index: 0
}
</style>
