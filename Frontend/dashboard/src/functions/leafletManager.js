import leaflet from 'leaflet'
/* Leaflet functionality outsourced in extra js file, because
 * it is necessary to store references to map and layer. If these
 * references get stored in the vue-data function, there begins an
 * endless loading an the browser starts begging for RAM.
 */
export default class leafletManager {
  _mapId = null
  _map = null
  _geoJsonLayer = null
  _geoData = null
  _infectionData = null
  _minCases = 0
  _maxCases = 0
  _fillColor = 'LightSlateGrey'
  _positionChangeCallback = this.defaultCallback
  _zoomChangeCallback = this.defaultCallback
  _featureSelectChangeCallback = this.defaultCallback

  constructor({mapId, position, zoom }) {
    const that = this
    this._mapId = mapId
    this._map = leaflet.map(this._mapId).setView(position, zoom)

    this._map.on('zoomend', function(){
      that.zoomChanged(that)
    })

    this._map.on('moveend', function() {
      that.positionChanged(that)
    })
  }

  updateMap(){

  }

  setGeoData(geoData) {
    this._geoData = geoData
    const that = this

    // Update Map Layer
    if (this._geoJsonLayer) {
      this._map.removeLayer(this._geoJsonLayer)
    }
    this._geoJsonLayer = leaflet
      .geoJSON(this._geoData, {
        onEachFeature: function(f, l) {
          l.bindPopup('<p>' + f.properties.county + ' <br/>(' + f.properties.BL + ')</p>')
          l.on('click', () => {that.featureSelected(f)})
        },
      })
      .addTo(this._map)

    this.updateMap()
  }

  setInfectionData(infectionData) {
    this._infectionData = infectionData
    this.updateMap()
  }

  setMapStyle(selectedCase) {
    if (!this._infectionData || !this._geoJsonLayer) {
      return
    }
    let that = this
    this.setMinMax(this._infectionData, selectedCase + '_LK')
    this._geoJsonLayer.eachLayer(function(layer) {
      layer.setStyle(that.featureStyling(layer.feature, selectedCase + '_LK'))
    })
  }

  getOpacity(countyName, stateName, caseName) {
    const county = this._infectionData.states
      .filter((state) => state.name === stateName)[0]
      .counties.find((county) => county.full_name === countyName)
    return 0.1 + ((0.9 - 0.1) / (this._maxCases - this._minCases)) * (county[caseName] - this._minCases)
  }

  featureStyling(feature, caseName) {
    return {
      fillColor: this._fillColor,
      weight: 1,
      opacity: 1,
      color: 'gray',
      dashArray: '0',
      fillOpacity: this.getOpacity(feature.properties.county, feature.properties.BL, caseName),
    }
  }

  setMinMax(data, caseName) {
    this._minCases = data.states[0].counties[0][caseName]
    this._maxCases = this._minCases

    data.states.forEach((state) => {
      state.counties.forEach((county) => {
        const cases = county[caseName]
        if (this._minCases > cases) {
          this._minCases = cases
        }

        if (this._maxCases < cases) {
          this._maxCases = cases
        }
      })
    })
  }

  focusMap({state, county}){

    if(state){ //Focus to state if set
      let states = []
      this._geoData.features.forEach(feature => {
        if(feature.properties.BL === state){
          states.push(feature)
        }
      })

      if(county){ //Focus to county if set
        let counties = []
        states.forEach(state => {
          if(state.properties.county === county){
            counties.push(state)
          }
        })
        const countyGroup = leaflet.geoJSON(counties)
        this._map.fitBounds(countyGroup.getBounds())
      }else{
        const stateGroup = leaflet.geoJSON(states) 
        this._map.fitBounds(stateGroup.getBounds())
      }
    }else{
      // Focus complete map
      this._map.fitBounds(this._geoJsonLayer.getBounds())
    }

  }

  fillColor(color) {
    this._fillColor = color
  }

  setView({ position, zoom }) {
    this._map.setView(position, zoom)
  }

  get zoom() {
    return this._map.getZoom()
  }

  get viewPosition() {
    return this._map.getCenter()
  }

  zoomChanged(instance){
    instance._zoomChangeCallback(instance._map.getZoom())
    setTimeout(function(){}, 2000)   //TODO: Remove or move
  }

  positionChanged(instance){
    instance._positionChangeCallback(instance._map.getCenter())
    setTimeout(function(){}, 2000) //TODO: Remove
  }

  featureSelected(feature){
    this._featureSelectChangeCallback(feature)
  }

  setPositionChangeCallback(func){
    this._positionChangeCallback = func
  }

  setZoomChangeCallback(func){
    this._zoomChangeCallback = func
  }

  setFeatureSelectChangeCallback(func){
    this._featureSelectChangeCallback = func
  }

  defaultCallback(param){
    console.log('Callback. Value: ', param)
  }

}