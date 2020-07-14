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
  #positionChangeCallback = this.defaultCallback
  #zoomChangeCallback = this.defaultCallback
  #featureSelectChangeCallback = this.defaultCallback

  constructor({mapId, position, zoom }) {
    const that = this
    this.#mapId = mapId
    this.#map = leaflet.map(this.#mapId).setView(position, zoom)

    this.#map.on('zoomend', function(){
      that.zoomChanged(that)
    })

    this.#map.on('moveend', function() {
      that.positionChanged(that)
    })
  }

  updateMap(){

  }

  setGeoData(geoData) {
    this.#geoData = geoData
    const that = this

    // Update Map Layer
    if (this.#geoJsonLayer) {
      this.#map.removeLayer(this.#geoJsonLayer)
    }
    this.#geoJsonLayer = leaflet
      .geoJSON(this.#geoData, {
        onEachFeature: function(f, l) {
          l.bindPopup('<p>' + f.properties.county + ' <br/>(' + f.properties.BL + ')</p>')
          l.on('click', () => {that.featureSelected(f)})
        },
      })
      .addTo(this.#map)

    this.updateMap()
  }

  setInfectionData(infectionData) {
    this.#infectionData = infectionData
    this.updateMap()
  }

  setMapStyle(selectedCase) {
    if (!this.#infectionData || !this.#geoJsonLayer) {
      return
    }
    let that = this
    this.setMinMax(this.#infectionData, selectedCase + '_LK')
    this.#geoJsonLayer.eachLayer(function(layer) {
      layer.setStyle(that.featureStyling(layer.feature, selectedCase + '_LK'))
    })
  }

  getOpacity(countyName, stateName, caseName) {
    const county = this.#infectionData.states
      .filter((state) => state.name === stateName)[0]
      .counties.find((county) => county.full_name === countyName)
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

  focusMap({state, county}){

    if(state){ //Focus to state if set
      let states = []
      this.#geoData.features.forEach(feature => {
        if(feature.properties.BL === state){
          states.push(feature)
        }
      })
      let fGroup = leaflet.geoJSON(states) //.addTo(this.#map)
      this.#map.fitBounds(fGroup.getBounds())

      if(county){ //Focus to county if set
        let counties = []
        states.forEach(state => {
          if(state.properties.county === county){
            counties.push(state)
          }
        })
        fGroup = leaflet.geoJSON(counties)
        this.#map.fitBounds(fGroup.getBounds())
      }
    }else{
      // Focus complete map
      this.#map.fitBounds(this.#geoJsonLayer.getBounds())
    }

  }

  fillColor(color) {
    this.#fillColor = color
  }

  setView({ position, zoom }) {
    this.#map.setView(position, zoom)
  }

  get zoom() {
    return this.#map.getZoom()
  }

  get viewPosition() {
    return this.#map.getCenter()
  }

  zoomChanged(instance){
    instance.#zoomChangeCallback(instance.#map.getZoom())
    setTimeout(function(){}, 2000)   //TODO: Remove or move
  }

  positionChanged(instance){
    instance.#positionChangeCallback(instance.#map.getCenter())
    setTimeout(function(){}, 2000) //TODO: Remove
  }

  featureSelected(feature){
    this.#featureSelectChangeCallback(feature)
  }

  setPositionChangeCallback(func){
    this.#positionChangeCallback = func
  }

  setZoomChangeCallback(func){
    this.#zoomChangeCallback = func
  }

  setFeatureSelectChangeCallback(func){
    this.#featureSelectChangeCallback = func
  }

  defaultCallback(param){
    console.log('Callback. Value: ', param)
  }

}