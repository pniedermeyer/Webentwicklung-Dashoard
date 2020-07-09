import leaflet from 'leaflet'
/* Leaflet functionality outsourced in extra js file, because
* it is necessary to store references to map and layer. If these
* references get stored in the vue-data function, there begins an
* endless loading an the browser starts begging for RAM.
*/
export default class leafletManager {
  #mapId = null
  #map = null
  #geoJsonLayer = null
  #geoData = null
  #infectionData = null
  #minCases = 0
  #maxCases = 0
  #fillColor = 'LightSlateGrey'

  constructor(mapId) {
    this.#mapId = mapId
  }

  initializeMap({ position, zoom }) {
    this.#map = leaflet.map(this.#mapId).setView(position, zoom)
  }

  setGeoData(geoData) {
    this.#geoData = geoData

    // Update Map Layer
    if (this.#geoJsonLayer) {
      this.#map.removeLayer(this.#geoJsonLayer)
    }
    this.#geoJsonLayer = leaflet
      .geoJSON(this.#geoData, {
        onEachFeature: function (f, l) {
          l.bindPopup('<pre>' + f.properties.county + '</pre>')
        },
      })
      .addTo(this.#map)
  }

  setInfectionData(infectionData) {
    this.#infectionData = infectionData
  }

  setMapStyle(selectedCase) {
    if (!this.#infectionData || !this.#geoJsonLayer) {
      return
    }
    let that = this
    this.setMinMax(this.#infectionData, selectedCase + '_LK')
    this.#geoJsonLayer.eachLayer(function (layer) {
      layer.setStyle(that.featureStyling(layer.feature, selectedCase + '_LK'))
    })
  }

  getOpacity(countyName, stateName, caseName) {
    /*
      opacity: y1 = 0.1 (min)
                y2 = 0.9 (max)
      cases: x1 = min
              x2 = max
      formel: y1 + ((y2 - y1) / (x2 - x1)) * (x - x1)
      */

    const county = this.#infectionData.states.filter((state) => state.name === stateName)[0].counties.find((county) => county.LK === countyName)
    return 0.1 + ((0.9 - 0.1) / (this.#maxCases - this.#minCases)) * (county[caseName] - this.#minCases)
  }

  featureStyling(feature, caseName) {
    return {
      fillColor: this.#fillColor,
      weight: 1,
      opacity: 1,
      color: 'gray',
      dashArray: '0',
      fillOpacity: this.getOpacity(feature.properties.county, feature.properties.BL, caseName),
    }
  }

  setMinMax(data, caseName) {
    this.#minCases = data.states[0].counties[0][caseName]
    this.#maxCases = this.#minCases

    data.states.forEach((state) => {
      state.counties.forEach((county) => {
        const cases = county[caseName]
        if (this.#minCases > cases) {
          this.#minCases = cases
        }

        if (this.#maxCases < cases) {
          this.#maxCases = cases
        }
      })
    })
  }

  fillColor(color) {
    this.#fillColor = color
  }

  get zoom() {
    return ''
  }

  get viewPosition() {
    return ''
  }
}