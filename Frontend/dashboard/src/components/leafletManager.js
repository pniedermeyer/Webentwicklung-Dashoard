import leaflet from 'leaflet'
export default class leafletManager {
  #mapId = null
  #map = null
  #geoJsonLayer = null
  #geoData = null
  #infectionData = null
  #minCases = 0
  #maxCases = 0

  constructor(mapId) {
    this.#mapId = mapId
  }

  initializeMap() {
    this.#map = leaflet.map(this.#mapId).setView([51.5, 10.8], 5)
  }

  addMapLayer() {
    if (this.#geoJsonLayer) {
      this.#map.removeLayer(this.#geoJsonLayer)
    }
    this.#geoJsonLayer = leaflet
      .geoJSON(this.#geoData, {
        onEachFeature: function(f, l) {
          l.bindPopup('<pre>' + f.properties.county + '</pre>')
        },
      })
      .addTo(this.#map)
  }

  setGeoData(geoData) {
    this.#geoData = geoData
  }

  setInfectionData(infectionData) {
    this.#infectionData = infectionData
  }

  setMapStyle(selectedCase) {
    let that = this
    this.setMinMax(this.#infectionData, selectedCase + '_LK')
    this.#geoJsonLayer.eachLayer(function(layer) {
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
      fillColor: 'red',
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

  get zoom() {
    return ''
  }

  get viewPosition() {
    return ''
  }
}
