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

      germanyData.states = originalData.features.reduce((acc: any, county: any) => {
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
        let recovered = county.attributes.recovered
        if (recovered === null) {
          recovered = 0
        }

        const newCounty = {
          LK_ID: 1,
          LK: county.attributes.county,
          GEN: county.attributes.GEN,
          cases_LK: county.attributes.cases,
          deaths_LK: county.attributes.deaths,
          cases_per_100k_LK: county.attributes.cases_per_100k,
          cases7_per_100k_LK: county.attributes.cases7_per_100k,
          recovered_LK: recovered,
          change_LK: 0,
          new_cases_LK: 0,
        }
        state.counties.push(newCounty)

        state.cases_BL += newCounty.cases_LK
        state.deaths_BL += newCounty.deaths_LK
        state.cases_per_100k_BL += newCounty.cases_per_100k_LK
        state.cases7_per_100k_BL += newCounty.cases7_per_100k_LK
        state.recovered_BL += newCounty.recovered_LK
        state.change_BL += newCounty.change_LK
        state.new_cases_BL += newCounty.new_cases_LK

        germanyData.cases_DE += newCounty.cases_LK
        germanyData.deaths_DE += newCounty.deaths_LK
        germanyData.cases_per_100k_DE += newCounty.cases_per_100k_LK
        germanyData.cases7_per_100k_DE += newCounty.cases7_per_100k_LK
        germanyData.recovered_DE += newCounty.recovered_LK
        germanyData.change_DE += newCounty.change_LK
        germanyData.new_cases_DE += newCounty.new_cases_LK

        return acc
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
