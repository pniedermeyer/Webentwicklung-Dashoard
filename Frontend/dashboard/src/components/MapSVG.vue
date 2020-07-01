<template>
  <div>
    <div>
      <div>
        <!-- resolution -->
        <label for="resolution">🗺️Auflösung:</label>
        <select v-model="resolution" v-on:change="resolutionChanged()">
          <option disabled value>Bitte wählen Sie</option>
          <option
            v-for="res in resolutions"
            v-bind:value="res.value"
            v-bind:key="res.value"
          >{{ res.text }}</option>
        </select>
      </div>
      <div>
        <!-- zoomlevel -->
        <label for="zoom">🔎Zoomlevel:</label>
        <input type="number" v-model="zoom" step="20" min="0" v-on:change="zoomLevelChanged()" />
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import axios from "axios";
import leaflet from "leaflet";
import leafletManager from "./leafletManager";

export default {
  name: "MapSVG",
  data() {
    return {
      geoData: null,
      map: null,
      geoJsonLayer: null,
      zoom: 100,
      resolution: 0,
      resolutions: [
        { text: "Niedrig", value: 2 },
        { text: "Mittel", value: 1 },
        { text: "Hoch", value: 0 }
      ],
      selectedBL: null,
      selectedLK: null,
      minCases: 0,
      maxCases: 0
    };
  },
  props: {
    selectedBL_ID: Number,
    selectedLK_ID: Number,
    infectionData: Object,
    selectedCaseOption: String,
    baseColor: Number
  },
  watch: {
    selectedBL_ID: function() {},
    selectedLK_ID: function() {},
    infectionData: function() {
      this.drawMapData();
    },
    selectedCaseOption: function() {
      this.drawMapData();
    },
    baseColor: function() {},
    geoData: function() {
      this.geoJsonLayer = new leafletManager("map");
      this.geoJsonLayer.initializeMap();
      this.geoJsonLayer.addMapLayer(this.geoData);
    }
  },
  methods: {
    fetchGeoData(res = 0) {
      let that = this;
      let url = `http://localhost:3001/geodata?` + "res=" + res;
      axios
        .get(url)
        .then(function(response) {
          that.geoData = response.data;
          //that.addMapLayer(response.data);
          console.log("fetch data success", response);
          //that.drawMapData() TODO reuse
        })
        .catch(function(error) {
          console.log("fetch data error:", error);
        });
    },
    zoomLevelChanged() {},
    resolutionChanged() {
      this.fetchGeoData(this.resolution);
    },
    initializeMap() {
      //this.map = leaflet.map("map").setView([51.5, 10.8], 5);
      //console.log("Map initialized");
      //if (this.geoData) {
      //this.addMapLayer();
      //}
    },
    addMapLayer() {
      //if (this.map) {
      //var map = leaflet.map("map").setView([51.5, 10.8], 5);
      //console.log("Try to add map layer");
      //if (this.geoJsonLayer) {
      //this.map.removeLayer(this.geoJsonLayer);
      //}
      // this.geoJsonLayer =
      //var tempy = leaflet.geoJson(this.geoData).addTo(this.map);
      //console.log("Map Layer added");
      //console.log(tempy);
      //}
    },
    setMapStyle() {
      this.map.removeLayer(this.geoJsonLayer);
      this.geoJsonLayer = leaflet.geoJSON(this.geoData).addTo(this.map);
    },
    drawMapData() {
      //console.log("Draw Map Data triggered");
      /*let container = leaflet.DomUtil.get("map");
      if (container != null) {
        container._leaflet_id = null;
      }
      let map = leaflet.map("map").setView([51.5, 10.8], 5);*/
      /* Some example Events 
      map.on('zoomend', function() {
        console.log('Map Zoom changed: ', map.getZoom())
      })
      map.on('moveend', function() {
        console.log('Map moved: ', map.getCenter())
      })
      map.on('click', function(e) {
        console.log('Map clicked: ', e)
      }) */
      // const accessToken = 'pk.eyJ1IjoicHJhd2xleSIsImEiOiJja2MwdW90bmcxNHNhMzBuNGo1ajhlaGxrIn0.NeGOU_d2zDQV2B1LrI_m3g'
      // leaflet.tileLayer(
      //   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      //   {
      //     attribution:
      //       'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      //     maxZoom: 18,
      //     id: "mapbox/streets-v11",
      //     tileSize: 512,
      //     zoomOffset: -1,
      //     accessToken: accessToken
      //   }
      // ).addTo(map);
      // console.log(data)
      //his.setMinMax(this.infectionData);
      //leaflet.geoJson(this.geoData, { style: this.style }).addTo(map);
    },
    setMinMax(data) {
      this.minCases = data.states[0].counties[0][this.selectedCasesOption];
      this.maxCases = this.minCases;

      data.states.forEach(state => {
        state.counties.forEach(county => {
          const cases = county[this.selectedCasesOption];
          if (this.minCases > cases) {
            this.minCases = cases;
          }

          if (this.maxCases < cases) {
            this.maxCases = cases;
          }
        });
      });
      // this.minCases = data.features[0].properties.cases_per_100k
      // this.maxCases = this.minCases
      // data.features.forEach((feature) => {
      //   const cases_p_100k = feature.properties.cases_per_100k

      //   if (this.minCases > cases_p_100k) {
      //     this.minCases = cases_p_100k
      //   }

      //   if (this.maxCases < cases_p_100k) {
      //     this.maxCases = cases_p_100k
      //   }
      // })
    },
    featureStyling(feature) {
      return {
        fillColor: "red",
        weight: 1,
        opacity: 1,
        color: "gray",
        dashArray: "3",
        fillOpacity: this.getOpacity(
          feature.properties.county,
          feature.properties.BL
        )
      };
    },
    getOpacity(countyName, stateName) {
      /*
        opacity: y1 = 0.1 (min)
                 y2 = 0.9 (max)
        cases: x1 = min
               x2 = max
        formel: y1 + ((y2 - y1) / (x2 - x1)) * (x - x1)
       */

      const county = this.infectionData.states
        .filter(state => state.name === stateName)[0]
        .counties.find(county => county.LK === countyName);
      // console.log(county)
      // console.log(this.minCases, this.maxCases)
      return (
        0.1 +
        ((0.9 - 0.1) / (this.maxCases - this.minCases)) *
          (county["cases_LK"] - this.minCases)
      );
    }
  },
  created() {},
  mounted() {
    this.initializeMap();
    this.fetchGeoData();
  }
};
</script>

<style>
@import "../../node_modules/leaflet/dist/leaflet.css";
#map {
  height: 400px;
  /* max-height: 40rem;
  overflow: auto;
  height: 40rem; */
}
</style>
