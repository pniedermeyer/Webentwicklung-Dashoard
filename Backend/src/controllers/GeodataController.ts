import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { getConnection } from 'typeorm'
import { GeoData } from '../entity/GeoData'
import GeoDataAPI from '../map-data-manager/data-requests/geo-data-request'
import douglasPeucker from '../map-data-manager/utilities/douglas-peuker'

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

  static async writeGeoDataInResolution(resolution: number) {
    let data: any = await GeoDataAPI.get()
    let lk_id = 0
    let ring_id = 0
    let x: number[] = []
    let y: number[] = []
    data.forEach((bl: { counties: any[]; BL_ID: any }) => {
      bl.counties.forEach((lk) => {
        lk_id += 1
        lk.geometry.rings.forEach(async (ring: any[]) => {
          ring_id += 1
          ring.forEach((point: { x: number; y: number }) => {
            x.push(point.x)
            y.push(point.y)
          })
          getConnection()
            .createQueryBuilder()
            .insert()
            .into(GeoData)
            .values({
              blId: bl.BL_ID,
              lkId: lk_id,
              ringId: ring_id,
              res: resolution,
              x: x,
              y: y,
            })
            .execute()
        })
        ring_id = 0
      })
      lk_id = 0
    })
  }
}
export default GeoDataController

interface Bbox {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

interface Point {
  x: number
  y: number
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

function reducePoints(geoData: any, epsilon: any): any {
  geoData.forEach((state: any) => {
    state.counties.forEach((county: any) => {
      county.geometry.rings = county.geometry.rings.map((ring: Point[]) => {
        //creates bbox for each ring to check later which overlap (have potential borders)
        let bbox: Bbox = <Bbox>{
          minX: -1,
          minY: -1,
          maxX: 0,
          maxY: 0,
        }

        ring.forEach((point: Point) => {
          if (bbox.minX === -1 || bbox.minX > point.x) {
            bbox.minX = point.x
          }

          if (bbox.minY === -1 || bbox.minY > point.y) {
            bbox.minY = point.y
          }

          if (bbox.maxX < point.x) {
            bbox.maxX = point.x
          }

          if (bbox.maxY < point.y) {
            bbox.maxY = point.y
          }
        })

        ring.pop()

        return {
          original: ring,
          filtered: [],
          neighbours: [],
          bbox: bbox,
        }
      })
    })
  })

  geoData.forEach((state: any, stateIndex: number) => {
    state.counties.forEach((county: any, countyIndex: number) => {
      county.geometry.rings.forEach((ring: any, ringIndex: number) => {
        for (let i = stateIndex; i < geoData.length; ++i) {
          let secondState: any = geoData[i].counties
          let j = stateIndex === i ? i : 0
          for (; j < secondState.length; ++j) {
            let secondCounty = secondState[j].geometry
            let k = countyIndex === j ? j + 1 : 0
            for (; k < secondCounty.rings.length; ++k) {
              let secondRing = secondCounty.rings[k]
              if (doOverlap(ring.bbox, secondRing.bbox)) {
                getNeighbours(ring, secondRing, stateIndex, i, countyIndex, j, ringIndex, k)
              }
            }
          }
        }
        ring.filtered = douglasPeucker(ring.original, epsilon)
      })
    })
  })

  geoData.forEach((state: any) => {
    state.counties.forEach((county: any) => {
      county.geometry.rings.forEach((ring: any) => {
        ring.neighbours.forEach((neighbour: any) => {
          let neighbourRing = geoData[neighbour.stateIndex].counties[neighbour.countyIndex].geometry.rings[neighbour.index]
          neighbour.points.forEach((point: Point) => {
            let includes = neighbourRing.filtered.some((nPoint: Point) => nPoint.x === point.x && nPoint.y === point.y)
            let isIncluded = ring.filtered.some((nPoint: Point) => nPoint.x === point.x && nPoint.y === point.y)

            if (includes && !isIncluded) {
              insertPoint(ring, point)
            }
          })
        })
        ring.filtered.push({
          x: ring.filtered[0].x,
          y: ring.filtered[0].y,
        })
      })
    })
  })

  // return geoData
  geoData.forEach((state: any) => {
    state.counties.forEach((county: any) => {
      county.geometry.rings = county.geometry.rings.map((ring: any) => ring.filtered)
    })
  })
  return geoData
}

function insertPoint(ring: any, point: Point) {
  const originalIndex: number = ring.original.findIndex((p: Point) => {
    return p.x === point.x && p.y === point.y
  })

  if (originalIndex === 0) {
    ip(0)
    return
  }

  if (originalIndex === ring.original.length - 1) {
    ring.filtered.push({ x: point.x, y: point.y })
    return
  }

  for (let i: number = originalIndex - 1; i >= 0; --i) {
    let prevElement: Point = ring.original[i]
    let prevElementIndex: number = ring.filtered.findIndex((p: Point) => {
      return p.x === prevElement.x && p.y === prevElement.y
    })

    if (prevElementIndex >= 0) {
      ip(prevElementIndex + 1)
      return
    }

    if (i === 0) {
      ip(0)
      return
    }
  }

  function ip(index: number) {
    ring.filtered.splice(index, 0, { x: point.x, y: point.y })
  }
}

function getNeighbours(r1: any, r2: any, s1: number, s2: number, c1: number, c2: number, i1: number, i2: number): any {
  const n1 = {
    stateIndex: s2,
    countyIndex: c2,
    index: i2,
    points: <Point[]>[],
  }
  const n2 = {
    stateIndex: s1,
    countyIndex: c1,
    index: i1,
    points: <Point[]>[],
  }

  let points: Point[] = []

  for (let i = 0; i < r1.original.length; ++i) {
    let p1 = r1.original[i]
    let index = r2.original.findIndex((point: Point) => {
      return point.x === p1.x && point.y === p1.y
    })

    if (index >= 0) {
      points.push(p1)
    }
  }

  if (points.length > 0) {
    n1.points = n2.points = points
    r1.neighbours.push(n1)
    r2.neighbours.push(n2)
  }
}

export const rp = reducePoints
