<template>
  <div>
    Hier SVG Shit
    <div>
      <div>
        <!-- resolution -->
        <label for="resolution">Auflösung:</label>

        <select v-model="resolution" v-on:change="resolutionChanged()">
          <option disabled value>Bitte wählen Sie</option>
          <option v-for="res in resolutions" v-bind:value="res.value" v-bind:key="res.value">{{ res.text }}</option>
        </select>
      </div>
      <div>
        <!-- zoomlevel -->
        <label for="zoom">Zoomlevel:</label>
        <input type="number" v-model="zoom" step="20" min="0" v-on:change="zoomLevelChanged()" />
      </div>
    </div>

    <div>
      <svg version="1.1" id="map_area" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MapSVG',
  data() {
    return {
      zoom: 100,
      resolution: 0,
      resolutions: [
        { text: 'Niedrig', value: 0 },
        { text: 'Mittel', value: 1 },
        { text: 'Hoch', value: 2 },
      ],
      selectedBL: null,
      selectedLK: null,
    }
  },
  props: {
    LK_ID: Number,
    BL_ID: Number,
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
      let url = `http://localhost:3001/geodata?` + 'res=' + res
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
      const mapSvg = document.getElementById('map_area')

      if (!Array.isArray(data)) {
        data = [data]
      }

      data.forEach((state) => {
        state.counties.forEach((county) => {
          county.geometry.rings.forEach((ring) => {
            var pathString = ''
            ring.forEach((coordinate) => {
              pathString += 'L ' + coordinate.x + ',' + coordinate.y + ' '
            })
            pathString += 'Z'
            pathString = 'M' + pathString.substring(1)

            var path = this.createSVGElement("path", {
              d: pathString,
              class: 'svg_element_primary_color_scheme svg_map_element svg_map_ring',
            });
            mapSvg.appendChild(path);
          });
        });
      });
    },
    createSVGElement(name, attributes) {
      var element = document.createElementNS('http://www.w3.org/2000/svg', name)
      for (const attName in attributes) {
        element.setAttribute(attName, String(attributes[attName]))
      }
      return element
    },
  },
}
</script>
