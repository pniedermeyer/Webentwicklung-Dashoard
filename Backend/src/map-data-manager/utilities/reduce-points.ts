import { FeatureCollection, Feature, BBox, Polygon, Position } from 'geojson'
import fs from 'fs'

class ReduceGeoJsonPoints {
  static reducePointsT(geoJson: FeatureCollection): FeatureCollection {
    let helperObjects: reducePointsHelper[] = ReduceGeoJsonPoints.getHelperObjects(geoJson)
    ReduceGeoJsonPoints.findNeighbours(geoJson, helperObjects)

    fs.writeFile('helloworld.json', JSON.stringify(helperObjects, null, 2), function (err) {
      if (err) return console.log(err)
      console.log('Hello World > helloworld.txt')
    })
    return geoJson
  }

  /**
   * creates for every ring a helper entry
   * includes only the featureIndex, ringIndex and bbox
   * @param geoJson
   */
  private static getHelperObjects(geoJson: FeatureCollection): reducePointsHelper[] {
    const helperObjects: reducePointsHelper[] = []

    geoJson.features.forEach((feature: Feature, featureIndex: number) => {
      const polygon: Polygon = <Polygon>feature.geometry

      polygon.coordinates.forEach((ring: Position[], ringIndex: number) => {
        const helperObject: reducePointsHelper = {
          polygonIndex: featureIndex,
          ringIndex: ringIndex,
          bbox: ReduceGeoJsonPoints.getBBox(ring, polygon.type),
        }
        helperObjects.push(helperObject)
      })
    })
    return helperObjects
  }

  private static findNeighbours(geoJson: FeatureCollection, helperObjects: reducePointsHelper[]) {
    // geoJson.features.forEach((feature: Feature) => {
    //   const polygon: Polygon = <Polygon>feature.geometry
    // })
  }

  private static getBBox(coordinates: Position[], type: string): BBox {
    let initValue: number = coordinates[0][0]
    /**
     * Bbox: 0 = minY, 1 = maxY, 2 = minX, 3 = maxX
     */

    let bbox: BBox = [initValue, initValue, initValue, initValue]

    coordinates.forEach((position: Position) => {
      //minX > x
      if (bbox[2] > position[0]) {
        bbox[2] = position[0]
      }

      //minY > y
      if (bbox[0] > position[1]) {
        bbox[0] = position[1]
      }

      //maxX < x
      if (bbox[3] < position[0]) {
        bbox[3] = position[0]
      }

      //maxY < y
      if (bbox[1] < position[1]) {
        bbox[1] = position[1]
      }
    })

    return bbox
  }
}

type reducePointsHelper = {
  polygonIndex: number
  ringIndex: number
  bbox: BBox
  secondIndex?: number
  secondRingIndex?: number
  equalPoints?: Position[]
}

export default ReduceGeoJsonPoints.reducePointsT
