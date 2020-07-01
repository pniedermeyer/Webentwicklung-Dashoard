import leaflet from 'leaflet'
export default class leafletManager {
  #mapId = null
  #map = null
  #geoJsonLayer = null
  #geoData = null

  constructor(mapId) {
    //console.log('leafletManager constructor. Passed Map-ID: ', mapId)
    this.#mapId = mapId
  }

  initializeMap() {
    //console.log('leafletManager Map init. Map-ID: ', this.#mapId)
    this.#map = leaflet.map(this.#mapId).setView([51.5, 10.8], 5)
  }

  addMapLayer() {
    //console.log('leafletManager add Map layer')
    this.#geoJsonLayer = leaflet.geoJSON(this.#geoData).addTo(this.#map)
  }

  setGeoData(geoData){
    this.#geoData = geoData
  }

  setMapStyle() {
    this.#map.removeLayer(this.#geoJsonLayer);
    this.#geoJsonLayer = leaflet.geoJSON(this.#geoData).addTo(this.#map);
  }

  get zoom() {
    return ''
  }

  get viewPosition() {
    return ''
  }
}
