import leaflet from 'leaflet'
export default class leafletManager {
  #mapId = null
  #map = null
  #geoJsonLayer = null

  constructor(mapId) {
    console.log('leafletManager constructor. Passed Map-ID: ', mapId)
    this.#mapId = mapId
  }

  initializeMap() {
    console.log('leafletManager Map init. Map-ID: ', this.#mapId)
    this.#map = leaflet.map(this.#mapId).setView([51.5, 10.8], 5)
  }

  addMapLayer(geoData) {
    console.log('leafletManager add Map layer')
    this.#geoJsonLayer = leaflet.geoJSON(geoData).addTo(this.#map)
  }

  setMapStyle() {}

  get zoom() {
    return ''
  }

  get viewPosition() {
    return ''
  }
}
