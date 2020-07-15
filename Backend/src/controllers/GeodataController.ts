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
      let found = false
      let tries = 0
      let geoData: GeoDataObject[] = []
      while (!found && tries < 10) {
        geoData = await getConnection()
          .getRepository(GeoDataObject)
          .find({ where: { res: resolution } })

        if (geoData[0] !== undefined) {
          found = true
        } else {
          tries++
          await GeoDataController.Sleep(5000)
        }
      }

      res.send(geoData[0].geojson)
    } catch (error) {
      console.log(error)
      res.status(401).send('ERROR while fetching Data from Database!')
    }
  }

  static Sleep(milliseconds: number) {
    return new Promise((resolve: any) => setTimeout(resolve, milliseconds))
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
    await getConnection()
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
