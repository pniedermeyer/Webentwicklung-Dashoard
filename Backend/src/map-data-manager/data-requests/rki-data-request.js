import DataAPI from './data-request.js'

const request = {
  method: 'get',
  url:
    'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=',
}

let data = null

class RkiDataAPI {
  static ON_NEW_DATA = 'onNewData'
  static get() {
    if (data !== null) {
      console.log('from cash')
      return new Promise((resolve, reject) => {
        resolve(data)
      })
    }
    return DataAPI.get(request, normaliseData)

    function normaliseData(originalData) {
      if (data === null) {
        data = originalData.features
      }
      console.log('NEW  DATA TRANSFORMED!!!!')
      return originalData
    }
  }
}

export default RkiDataAPI
