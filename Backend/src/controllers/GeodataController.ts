import { Request, Response, json } from 'express'
import { getConnection } from 'typeorm'
import GeoDataAPI from '../data-requests/geo-data-request'
import { GeoDataObject } from '../entity/GeoDataObject'
import recuceGeoJSONPoints from '../utilities/advanced-reduce-points/advanced-reduce-points'
import { mapResolutionToEpsilon, mapResolutionToInt } from '../utilities/resolutionMapper'

class GeoDataController {
  /**
   * Reads geodata from the database as geojson in the requested resolution
   * and sends it back via the response object
   *
   * @param req Request object from express
   * @param res Response object from express
   */
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

  /**
   * Calls the API of the RKI and gets the geojson which will be persisted, in
   * the given resolution after it is transformed into that resolution via RDP
   *
   * @param resolution resolution corresponding to which the geojson will be
   * persisted in the database
   */
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

  static async initDB() {
    let sum: number = await getConnection().getRepository(GeoDataObject).count()
    if (sum === 0) {
      GeoDataController.writeGeoDataInResolution('low')
      GeoDataController.writeGeoDataInResolution('medium')
      GeoDataController.writeGeoDataInResolution('high')
      GeoDataController.writeGeoDataInResolution('original')
    }
  }
}

export default GeoDataController
