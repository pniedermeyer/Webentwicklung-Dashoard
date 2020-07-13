import DataAPI from './data-request'
import hashCode from '../utilities/hash-function'

let data: any = null

class RkiDataAPI {
  /**
   * Axios request object for infections data from RKI endpoint
   */
  private static requestLK = {
    method: 'get',
    url:
      'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=',
  }

  static ON_NEW_DATA = 'onNewData'

  /**
   * Method that requests the infections data from RKI endpoint and transforms
   * and returns it.
   */
  static async get() {
    if (data !== null) {
      console.log('from cache')
      return new Promise((resolve, reject) => {
        resolve(data)
      })
    }
    return DataAPI.get(this.requestLK, normaliseData)

    /**
     * We transform the original data into our own format consisting of different
     * aggregations. Top level we aggregate the infections in germany. Inside this
     * we aggregate data for the 16 states. In the states we then save each of the
     * counties data.
     *
     * @param originalData data that we received from the RKI infections endpoint
     */
    function normaliseData(originalData: any) {
      let dateMatches = originalData.features[0].attributes.last_update.match(/([0-9]{0,2})\.([0-9]{0,2})\.([0-9]{4})/)
      let date = new Date(dateMatches[3], dateMatches[2] - 1, dateMatches[1])
      const germanyData: any = {
        name: 'Deutschland',
        date: date.toDateString(),
        cases_DE: 0,
        deaths_DE: 0,
        cases_per_100k_DE: 0,
        cases7_per_100k_DE: 0,
        recovered_DE: 0,
        change_DE: 0,
        population_DE: 0,
        states: new Array(16),
      }
      germanyData.states = originalData.features.reduce((acc: any, county: any) => {
        let lkId: number = hashCode(county.attributes.county)

        const index = county.attributes.BL_ID - 1
        // Not the same state as before? --> new state object
        if (!acc[index]) {
          acc[index] = {
            blId: hashCode(county.attributes.BL),
            name: county.attributes.BL,
            cases_BL: 0,
            deaths_BL: 0,
            cases_per_100k_BL: 0,
            cases7_per_100k_BL: 0,
            recovered_BL: 0,
            change_BL: 0,
            population_BL: 0,
            counties: [],
          }
        }

        const state = acc[index]
        let recovered = county.attributes.recovered
        if (recovered === null) {
          recovered = 0
        }

        // County information is the granularity delivered from RKI
        const newCounty = {
          lkId: lkId,
          fullName: county.attributes.county,
          givenName: county.attributes.GEN,
          cases_LK: county.attributes.cases,
          deaths_LK: county.attributes.deaths,
          cases_per_100k_LK: county.attributes.cases_per_100k,
          cases7_per_100k_LK: county.attributes.cases7_per_100k,
          population_LK: county.attributes.EWZ,
          recovered_LK: recovered,
          change_LK: 0,
        }
        state.counties.push(newCounty)

        // Aggregate state data
        state.cases_BL += newCounty.cases_LK
        state.deaths_BL += newCounty.deaths_LK
        state.recovered_BL += newCounty.recovered_LK
        state.population_BL += county.attributes.EWZ

        // Aggregate data for all of germany
        germanyData.cases_DE += newCounty.cases_LK
        germanyData.deaths_DE += newCounty.deaths_LK
        germanyData.recovered_DE += newCounty.recovered_LK
        germanyData.population_DE += county.attributes.EWZ

        return acc
      }, germanyData.states)

      let newCasesPast7DaysDE: number = 0
      germanyData.states.forEach((state: any) => {
        let newCasesPast7DaysBL: number = state.counties.reduce((acc: number, county: any) => {
          return acc + (county.cases7_per_100k_LK / 100000) * county.population_LK
        }, new Number(0))
        newCasesPast7DaysBL = Math.round(newCasesPast7DaysBL)
        newCasesPast7DaysDE += newCasesPast7DaysBL
        state.cases7_per_100k_BL = (newCasesPast7DaysBL / state.population_BL) * 100000
        state.cases_per_100k_BL = (state.cases_BL / state.population_BL) * 100000
      })

      germanyData.cases_per_100k_DE = (germanyData.cases_DE / germanyData.population_DE) * 100000
      germanyData.cases7_per_100k_DE = (newCasesPast7DaysDE / germanyData.population_DE) * 100000

      if (data === null) {
        data = germanyData
      }
      return germanyData
    }
  }
}

export default RkiDataAPI
