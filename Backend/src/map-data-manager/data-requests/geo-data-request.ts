import DataAPI from './data-request'
import webMercator from '../utilities/web-mecrator'

let geoData: any = null

class GeoDataAPI {
  private static request = {
    method: 'get',
    url:
      'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=BL_ID%2C+county%2C+BL&returnGeometry=true&returnCentroid=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=',
  }

  static ON_NEW_DATA = 'onNewData'
  static get() {
    if (geoData !== null) {
      console.log('from cash')
      return new Promise((resolve, reject) => {
        resolve(JSON.parse(JSON.stringify(geoData)))
      })
    }
    return DataAPI.get(this.request, normaliseData)

    function normaliseData(originalData: any) {
      let tmp = originalData.features.reduce((acc: any, cur: any) => {
        let index = cur.attributes.BL_ID - 1

        if (!acc[index]) {
          acc[index] = {
            BL_ID: index + 1,
            name: cur.attributes.BL,
            counties: [],
          }
        }

        let state = acc[index]

        state.counties.push({
          name: cur.attributes.county,
          geometry: {
            rings: convertRings(cur.geometry.rings),
            centroid: cur.centroid,
          },
        })

        return acc
      }, new Array(16))

      if (geoData === null) {
        geoData = tmp
      }
      console.log('NEW  DATA TRANSFORMED!!!!')
      return JSON.parse(JSON.stringify(geoData))
    }

    function convertRings(rings: any) {
      return rings.map((ring: any) => {
        return (ring = ring.map((point: any) => {
          return {
            x: point[0],
            y: point[1],
          }
        }))
      })
    }
  }
}

export default GeoDataAPI
