import { Request, Response, json } from 'express'
import { getConnection } from 'typeorm'
import GeoDataAPI from '../data-requests/geo-data-request'
import { GeoDataObject } from '../entity/GeoDataObject'
import recuceGeoJSONPoints from '../utilities/advanced-reduce-points/advanced-reduce-points'
import { mapResolutionToEpsilon, mapResolutionToInt } from '../utilities/resolutionMapper'

class GeoDataController {
  static async geoData(req: Request, res: Response) {
    try {
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

  static async writeGeoDataInResolution(resolution: string) {
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
}

export default GeoDataController
