import DataAPI from './data-request.js'
import webMercator from '../src/map-data-manager/utilities/web-mercator.js'

const request = {
  method: 'get',
  url:
    'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=BL_ID%2C+county%2C+BL&returnGeometry=true&returnCentroid=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=',
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
      let tmp = originalData.features.reduce((acc, cur) => {
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
      return geoData
    }

    function convertRings(rings) {
      return rings.map((ring) => {
        return (ring = ring.map((point) => {
          const longitude = (point[0] * Math.PI) / 180
          const latitude = (point[1] * Math.PI) / 180
          return {
            x: webMercator.calculateX(0, longitude),
            y: webMercator.calculateY(0, latitude),
          }
        }))
      })
    }
  }
}

export default GeoDataAPI
