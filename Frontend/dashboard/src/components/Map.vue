<template>
  <div
    class="w-100"
    id="map-container"
    v-bind:class="{ mapNotVisible:!visibleComponents.mapVisible }"
  >
    <div v-show="visibleComponents.mapVisible" id="map"></div>
    <global-options @focus-map="focusMap()" />
  </div>
</template>

<script>
import axios from "axios";
import leafletManager from "../functions/leafletManager";
import { mapFields } from "vuex-map-fields";
import GlobalOptions from "./GlobalOptions.vue";
import {getBaseUrl} from "../functions/UrlUtils";

export default {
  name: "Map",
  components: {
    GlobalOptions
  },
  data() {
    return {
      lfltMng: null,
      geoDatas: [],
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
      mapResolution: "mapResolution",
      mapVisible: "mapVisible",
      visibleComponents: "visibleComponents"
    })
  },
  watch: {
    BL_ID: function() {
      
      console.log(this.geoDatas)
      let geoData = new Object()
      geoData.type = "FeatureCollection";
      geoData.features = this.geoDatas[this.mapResolution].features
      if(this.BL_ID !== 0 && geoData){ 
        geoData.features = geoData.features.filter(feature => feature.properties.BL_ID === this.BL_ID)
        this.lfltMng.addHighlightLayer(geoData)
      }
      
    },
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
    fetchGeoData(res) {
      let that = this;
      //TODO: Change Request URL for production
      let url = getBaseUrl()+`/geodata?` + "res=" + res;
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
      if (this.infectionData.states === undefined) {
        setTimeout(() => {
          this.resolutionChanged();
        }, 1000);
        return;
      }
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
    },
    focusMap() {
      // Find state to ID
      let state = this.infectionData.states.find(
        state => state.BL_ID === this.BL_ID
      );
      let county = null;
      // Find county to ID
      if (state) {
        county = state.counties.find(county => county.LK_ID === this.LK_ID);

        state = state.name;
        county = county ? county.full_name : null;
      }

      this.lfltMng.focusMap({ state: state, county: county });
    },
    setBrowserLocation(coordinates){
      const that = this
      const geos = this.geoDatas[this.mapResolution]
      if(!geos){
        setTimeout(() => {that.setBrowserLocation(coordinates)}, 1000)
      }else{
        const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');
        const glookup = new GeoJsonGeometriesLookup(geos);
        const point = {type: "Point", coordinates: [coordinates[1], coordinates[0]]};
        const features = glookup.getContainers(point)

        if(this.BL_ID === 0){
          this.selectedFeatureChange(features.features[0]) 
        }
      }
    },
    selectedFeatureChange(feature) {
      // that.BL_ID = e.properties.BL_ID // Currently not working bc of different IDs in geo- and infection-data
      const state = this.infectionData.states.find(
        state => state.name === feature.properties.BL
      );
      this.BL_ID = state.BL_ID;

      const county = state.counties.find(
        county => county.full_name === feature.properties.county
      );
      this.LK_ID = county.LK_ID;
    }
  },
  mounted() {
    const that = this;
    this.lfltMng = new leafletManager({
      mapId: "map",
      position: this.mapPosition,
      zoom: this.mapZoom
    });

    this.lfltMng.fillColor(this.baseColor);
    this.lfltMng.setPositionChangeCallback(function(e) {
      that.mapPosition = [e.lat, e.lng];
    });
    this.lfltMng.setZoomChangeCallback(function(e) {
      that.mapZoom = e;
    });
    this.lfltMng.setFeatureSelectChangeCallback(this.selectedFeatureChange);

    //manually trigger first geodata request
    this.resolutionChanged();
  }
};
</script>

<style>
@import "../../node_modules/leaflet/dist/leaflet.css";
#map {
  height: 100%;
  /* background: rgb(127, 127, 243); */
  /* height: 100%; */
}

#map-container {
  height: 600px;
  position: relative;
  z-index: 0;
}
.leaflet-container {
  background-color: rgba(183, 183, 246, 0.308);
}

.mapNotVisible {
  height: 15rem !important;
}
</style>
