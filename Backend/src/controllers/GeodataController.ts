import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { getConnection } from 'typeorm'
import { GeoData } from '../entity/GeoData'

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
}
export default GeoDataController

interface Bbox {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

function doOverlap(bbox1: Bbox, bbox2: Bbox): boolean {
  // If one rectangle is on left side of other
  if (bbox1.minX > bbox2.maxX || bbox2.minX > bbox1.maxX) {
    return false
  }

  // If one rectangle is above other
  if (bbox1.maxY < bbox2.minY || bbox2.maxY < bbox1.minY) {
    return false
  }

  return true
}

function reducePoints(geoData: any) {}
