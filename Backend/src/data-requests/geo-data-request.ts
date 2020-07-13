import DataAPI from './data-request'

let geoData: any = null

class GeoDataAPI {
  
  /** 
   * Axios request object for GeoJSON from RKI endpoint
   */
  private static request = {
    method: 'get',
    url:
      'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=BL_ID%2C+county%2C+BL&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=',
  }

  /**
   * Method that requests the GeoJSON from RKI endpoint and returns it
   */
  static get() {
    if (geoData !== null) {
      console.log('from cache')
      return new Promise((resolve, reject) => {
        resolve(JSON.parse(JSON.stringify(geoData)))
      })
    }
    return DataAPI.get(this.request, normaliseData)

    function normaliseData(originalData: any) {
      return originalData
    }
  }
}

export default GeoDataAPI
