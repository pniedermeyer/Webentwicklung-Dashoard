import { Request, Response, json } from 'express'
import { getConnection } from 'typeorm'
import GeoDataAPI from '../map-data-manager/data-requests/geo-data-request'
import { GeoDataObject } from '../entity/GeoDataObject'
import recuceGeoJSONPoints from '../map-data-manager/utilities/advanced-reduce-points/advanced-reduce-points'

class GeoDataController {
  static async geoData(req: Request, res: Response) {
    try {
      // GeoDataController.write('high')
      // GeoDataController.write('medium')
      // GeoDataController.write('low')

      let resolution: any = req.query.res
      if (resolution === undefined) {
        resolution = 1
      }
      let geoData: GeoDataObject[] = await getConnection()
        .getRepository(GeoDataObject)
        .find({ where: { res: resolution } })

      res.send(geoData[0].geojson)
    } catch (error) {
      console.log(error)
      res.status(401).send('ERROR while fetching Data from Database!')
    }
  }

  static async write(resolution: string) {
    // let data: any = await GeoDataController.getGeoJSON()
    let rawData: any = await GeoDataAPI.get()
    const res = mapResolutionToInt(resolution)
    let epsilon = mapResolutionToEpsilon(resolution)
    let reducedData = recuceGeoJSONPoints(rawData, epsilon)
    getConnection()
      .createQueryBuilder()
      .insert()
      .into(GeoDataObject)
      .values({
        geojson: reducedData,
        res: res,
      })
      .execute()
  }

  // static async mapPoints(geoData: any) {
  //   const jsonResponse: any = []
  //   geoData.forEach((county: GeoData) => {
  //     if (!jsonResponse[county.blId - 1]) {
  //       jsonResponse[county.blId - 1] = {
  //         BL_ID: county.blId,
  //         counties: [],
  //       }
  //     }

  //     const state = jsonResponse[county.blId - 1]
  //     if (!state.counties[county.lkId - 1]) {
  //       state.counties[county.lkId - 1] = {
  //         LK_ID: county.lkId,
  //         geometry: {
  //           rings: [],
  //         },
  //       }
  //     }

  //     const rings = state.counties[county.lkId - 1].geometry.rings

  //     if (!rings[county.ringId - 1]) {
  //       rings[county.ringId - 1] = []
  //     }

  //     const ring = rings[county.ringId - 1]
  //     county.x.forEach((value: number, index: number) => {
  //       ring.push({
  //         x: value,
  //         y: county.y[index],
  //       })
  //     })
  //   })
  //   return jsonResponse
  // }

  // static async mapPoints(geoData: any) {
  //   const jsonResponse: any = []
  //   geoData.forEach((bl: any) => {
  //     if (typeof jsonResponse[bl.blId] === 'undefined') {
  //       jsonResponse[bl.blId] = {
  //         BL_ID: bl.blId,
  //         counties: [],
  //       }
  //     }
  //   })
  //   geoData.forEach((e: any) => {
  //     if (typeof jsonResponse[e.blId].counties[e.lkId] === 'undefined') {
  //       jsonResponse[e.blId].counties[e.lkId] = {
  //         geometry: [],
  //       }
  //     }
  //   })
  //   // console.log('jsonresponse', jsonResponse[1].counties[1])

  //   // let mappedData = geoData[0].x.map((dataX: any, index: any) => {
  //   //   return { x: dataX, y: geoData[0].y[geoData[0].y.length - (index + 1)] }
  //   // })
  //   // console.log(mappedData)
  //   return geoData
  // }

  // static async writeGeoDataInResolution(resolution: String) {
  //   let data: any = await GeoDataAPI.get()
  //   const res = mapResolutionToInt(resolution)
  //   data = rp(data, mapResolutionToEpsilon(resolution))
  //   let lk_id = 0
  //   let ring_id = 0
  //   let x: number[] = []
  //   let y: number[] = []
  //   data.forEach((bl: { counties: any[]; BL_ID: any }) => {
  //     bl.counties.forEach((lk) => {
  //       lk_id += 1
  //       lk.geometry.rings.forEach(async (ring: any[]) => {
  //         ring_id += 1
  //         ring.forEach((point: { x: number; y: number }) => {
  //           x.push(point.x)
  //           y.push(point.y)
  //         })
  //         getConnection()
  //           .createQueryBuilder()
  //           .insert()
  //           .into(GeoData)
  //           .values({
  //             blId: bl.BL_ID,
  //             lkId: lk_id,
  //             ringId: ring_id,
  //             res: res,
  //             x: x,
  //             y: y,
  //           })
  //           .execute()
  //         x = []
  //         y = []
  //       })
  //       ring_id = 0
  //     })
  //     lk_id = 0
  //   })
  // }
}
export default GeoDataController

function mapResolutionToInt(resolution: String) {
  switch (resolution) {
    case 'low':
      return 2
      break
    case 'medium':
      return 1
    default:
      return 0
      break
  }
}

function mapResolutionToEpsilon(resolution: String) {
  switch (resolution) {
    case 'low':
      return 0.0001
      break
    case 'medium':
      return 0.00001
    default:
      return 0.000001
      break
  }
}
