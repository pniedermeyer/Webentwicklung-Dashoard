import DataAPI from './data-request.js'

const request = {
  method: 'get',
  url:
    'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=BL_ID%2C+county&returnGeometry=true&returnCentroid=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=',
}

let geoData = null

class GeoDataAPI {
  static ON_NEW_DATA = 'onNewData'
  static get() {
    if (geoData !== null) {
      console.log('from cash')
      return new Promise((resolve, reject) => {
        resolve(geoData)
      })
    }
    return DataAPI.get(request, normaliseData)

    function normaliseData(originalData) {
      if (geoData === null) {
        geoData = originalData.features
      }
      console.log('NEW  DATA TRANSFORMED!!!!')
      return geoData
    }
  }
}

export default GeoDataAPI
