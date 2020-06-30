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
      <div>
        <!-- zoomlevel -->
        <label for="zoom">🔎Zoomlevel:</label>
        <input type="number" v-model="zoom" step="20" min="0" v-on:change="zoomLevelChanged()" />
      </div>
    </div>

    <div id="mapContainer">
      <svg version="1.1" id="map_area" />
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import axios from 'axios'
import L from 'leaflet'

export default {
  name: 'MapSVG',
  data() {
    return {
      zoom: 100,
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
    LK_ID: Number,
    BL_ID: Number,
    infectionData: Object,
  },
  created() {
    this.fetchGeoData()
  },
  methods: {
    fetchGeoData(res = 0) {
      let that = this

      // const request = {
      //   url: `http://localhost:3001/geodata?` + 'res=' + res,
      //   method: 'get',
      //   headers: {
      //     'Access-Control-Allow-Origin': 'http://localhost:3001',
      //   },
      // }
      let url = `http://localhost:8888/geodata?` + 'res=' + res
      console.log(url)
      // axios
      //   .request(request)
      //   .then(function(response) {
      //     console.log('fetch data success' + response)
      //     that.processMapData(response.data)
      //   })
      //   .catch(function(error) {
      //     console.log('fetch data error:' + error)
      //   })
      axios
        .get(url)
        .then(function(response) {
          console.log('fetch data success' + response)
          that.processMapData(response.data)
        })
        .catch(function(error) {
          console.log('fetch data error:' + error)
        })
    },
    zoomLevelChanged() {
      const mapSvg = document.getElementById('map_area')
      mapSvg.setAttribute('width', this.zoom)
    },
    resolutionChanged() {
      this.fetchGeoData(this.resolution)
    },
    processMapData(mapData) {
      const svg = document.getElementById('map_area')
      svg.innerHTML = ''
      this.drawMapData(mapData)

      const svgBbox = svg.getBBox()
      svg.setAttribute('viewBox', svgBbox.x + ' ' + svgBbox.y + ' ' + svgBbox.width + ' ' + svgBbox.height)
      svg.setAttribute('width', this.zoom)
    },
    drawMapData(data) {
      let map = L.map('mapContainer', {
        center: [51.505, -0.09],
        zoom: 13,
      })

      // const accessToken = 'pk.eyJ1IjoicHJhd2xleSIsImEiOiJja2MwdW90bmcxNHNhMzBuNGo1ajhlaGxrIn0.NeGOU_d2zDQV2B1LrI_m3g'

      // L.tileLayer(
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
      console.log(data)
      this.setMinMax(this.infectionData)

      L.geoJson(data, { style: this.style }).addTo(map)
    },
    setMinMax(data) {
      console.log(data)

      this.minCases = data.states[0].counties[0]['cases_LK']
      this.maxCases = this.minCases

      data.states.forEach((state) => {
        state.counties.forEach((county) => {
          const cases = county['cases_LK']
          if (this.minCases > cases) {
            this.minCases = cases
          }

          if (this.maxCases < cases) {
            this.maxCases = cases
          }
        })
      })
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
    style(feature) {
      return {
        fillColor: 'red',
        weight: 1,
        opacity: 1,
        color: 'gray',
        dashArray: '3',
        fillOpacity: this.getOpacity(feature.properties.county, feature.properties.BL),
      }
    },
    getOpacity(countyName, stateName) {
      /*
        opacity: y1 = 0.1 (min)
                 y2 = 0.9 (max)
        cases: x1 = min
               x2 = max
        formel: y1 + ((y2 - y1) / (x2 - x1)) * (x - x1)
       */

      const county = this.infectionData.states.filter((state) => state.name === stateName)[0].counties.find((county) => county.LK === countyName)
      console.log(county)
      console.log(this.minCases, this.maxCases)
      return 0.1 + ((0.9 - 0.1) / (this.maxCases - this.minCases)) * (county['cases_LK'] - this.minCases)
    },
  },
}
</script>

<style>
@import '../../node_modules/leaflet/dist/leaflet.css';
#mapContainer {
  /* max-height: 40rem;
  overflow: auto;
  height: 40rem; */
}
</style>
