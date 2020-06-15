import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { getConnection } from 'typeorm'
import { GeoData } from '../entity/GeoData'
import GeoDataAPI from '../map-data-manager/data-requests/geo-data-request'

class GeoDataController {
  static geoData = async (req: Request, res: Response) => {
    let geoData
    GeoData
    try {
      geoData = await getConnection().getRepository(GeoData).find()
    } catch (error) {
      res.status(401).send()
    }
    res.send(geoData)
  }

  static async writeGeoDataInResolution (resolution: number) {
    let data: any = await GeoDataAPI.get()
    let lk_id = 0
    let ring_id = 0
    let x: number[] = []
    let y: number[] = []
    data.forEach((bl: { counties: any[]; BL_ID: any }) => {
      bl.counties.forEach(lk => {
        lk_id += 1
        lk.geometry.rings.forEach(async (ring: any[]) =>  {
          ring_id += 1
          ring.forEach((point: { x: number; y: number }) => {
            x.push(point.x)
            y.push(point.y)
          })
          getConnection().createQueryBuilder().insert().into(GeoData).values({
            blId: bl.BL_ID,
            lkId: lk_id,
            ringId: ring_id,
            res: resolution,
            x: x,
            y: y
          }).execute()
        })
        ring_id = 0
      })
      lk_id = 0
    })
  }
}
export default GeoDataController
