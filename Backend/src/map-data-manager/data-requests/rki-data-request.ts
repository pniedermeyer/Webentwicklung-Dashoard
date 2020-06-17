import DataAPI from './data-request'

let data: any = null

class RkiDataAPI {
  private static request = {
    method: 'get',
    url:
      'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=',
  }

  static ON_NEW_DATA = 'onNewData'
  static get() {
    if (data !== null) {
      console.log('from cash')
      return new Promise((resolve, reject) => {
        resolve(data)
      })
    }
    return DataAPI.get(this.request, normaliseData)

    function normaliseData(originalData: any) {
      const germanyData: any = {
        name: 'Deutschland',
        cases_DE: 0,
        deaths_DE: 0,
        cases_per_100k_DE: 0,
        cases7_per_100k_DE: 0,
        recovered_DE: 0,
        change_DE: 0,
        new_cases_DE: 0,
        states: new Array(16),
      }

      germanyData.states = originalData.reduce((acc: any, county: any) => {
        const index = county.attributes.BL_ID - 1

        if (!acc[index]) {
          acc[index] = {
            BL_ID: county.attributes.BL_ID,
            name: county.attributes.BL,
            cases_BL: 0,
            deaths_BL: 0,
            cases_per_100k_BL: 0,
            cases7_per_100k_BL: 0,
            recovered_BL: 0,
            change_BL: 0,
            new_cases_BL: 0,
            counties: [],
          }
        }

        const state = acc[index]
        const county = {}
      }, germanyData.states)

      if (data === null) {
        data = germanyData
      }
      console.log('NEW  DATA TRANSFORMED!!!!')
      return germanyData
    }
  }
}

export default RkiDataAPI
