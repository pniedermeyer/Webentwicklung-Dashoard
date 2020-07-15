import { FeatureCollection, Feature, Position, Polygon, MultiPolygon } from 'geojson'
import { Point, SubPath } from './subclasses'
import { BBox, Path, intermediateStruct, PathPoint } from './types'
import PathManager from './path-manager'
import douglasPeucker from '../douglas-peuker'

/**
 * Usually we would look at each county seperately and reduce these points with RDP.
 * Here we could get some white spots for counties that share borders and differents points are removed.
 */

class GeoJSONReduction {
  static recuceGeoJSONPoints(geoJSON: FeatureCollection, epsilon: number) {
    let iss: intermediateStruct[] = GeoJSONReduction.createIntermediateStructs(geoJSON)
    GeoJSONReduction.splitIntoCommonBorderLines(iss)

    iss.forEach((is: intermediateStruct) => {
      GeoJSONReduction.reduceMainPathToSubpaths(is.mainPath)
    })
    // Reduce each subpath with RDP
    PathManager.getSubPaths().forEach((subPath: SubPath) => {
      subPath.points = douglasPeucker(subPath.points, epsilon)
    })
    // Replace subpath pointers with actual points.
    iss.forEach((is: intermediateStruct) => {
      PathManager.buildPath(is.mainPath)
    })

    GeoJSONReduction.createNewGeoJSON(geoJSON, iss)

    return geoJSON
  }

  /**
   * Transform GeoJSON into intermediate format where we capture the position of the county in the GeoJSON
   * and all of the coordinates. We save the coordinate in a path object.
   * @param geoJson map information in finest granularity
   * @returns intermediate GeoJSON like format
   */
  private static createIntermediateStructs(geoJson: FeatureCollection): intermediateStruct[] {
    const intermediateStructs: intermediateStruct[] = []
    geoJson.features.forEach((feature: Feature, featureIndex: number) => {
      if (feature.geometry.type === polygonType) {
        //type = Polygon
        const polygon = <Polygon>feature.geometry
        polygon.coordinates.forEach((coordinate: Position[], coordinateIndex: number) => {
          const is = GeoJSONReduction.createIS(polygonType, coordinate, featureIndex, 0, coordinateIndex)
          intermediateStructs.push(is)
        })
      } else {
        //type = Multipolygon
        const multiPolygon = <MultiPolygon>feature.geometry
        multiPolygon.coordinates.forEach((ring: Position[][], ringIndex: number) => {
          ring.forEach((coordinate: Position[], coordinateIndex: number) => {
            const is = GeoJSONReduction.createIS(multiPolygonType, coordinate, featureIndex, ringIndex, coordinateIndex)
            intermediateStructs.push(is)
          })
        })
      }
    })
    return intermediateStructs
  }

  /**
   * We create the intermediate data structure from the given parameters
   * @param type 
   * @param coordinate 
   * @param fi 
   * @param ri 
   * @param ci 
   */
  private static createIS(type: string, coordinate: Position[], fi: number, ri: number, ci: number): intermediateStruct {
    const points: Point[] = []
    coordinate.forEach((position: Position) => {
      points.push(new Point(position[0], position[1]))
    })
    //remove last point
    points.pop()

    return {
      type: type,
      featureIndex: fi,
      ringIndex: ri,
      coordinateIndex: ci,
      bbox: GeoJSONReduction.getBbox(points),
      mainPath: PathManager.createNewPath(points),
    }
  }

  /**
   * Identify shared borders and save those as subpaths such that multiple paths from different 
   * counties may point to them.
   * @param iss intermediate GeoJSON like data structure
   */
  private static splitIntoCommonBorderLines(iss: intermediateStruct[]) {
    iss.forEach((is: intermediateStruct, isIndex: number) => {
      for (let i = isIndex + 1; i < iss.length; ++i) {
        if (GeoJSONReduction.doOverlap(is.bbox, iss[i].bbox)) {
          GeoJSONReduction.findCommonBorders(is.mainPath, iss[i].mainPath)
        }
      }
    })
  }

  private static doOverlap(bbox1: BBox, bbox2: BBox) {
    if (bbox1.minX > bbox2.maxX || bbox2.minX > bbox1.maxX) {
      return false
    }

    if (bbox1.maxY < bbox2.minY || bbox2.maxY < bbox1.minY) {
      return false
    }

    return true
  }

  private static getBbox(points: Point[]): BBox {
    const bbox: BBox = { minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxX: Number.MIN_VALUE, maxY: Number.MIN_VALUE }

    points.forEach((point: Point) => {
      if (bbox.minX > point.x) {
        bbox.minX = point.x
      }

      if (bbox.minY > point.y) {
        bbox.minY = point.y
      }

      if (bbox.maxX < point.x) {
        bbox.maxX = point.x
      }

      if (bbox.maxY < point.y) {
        bbox.maxY = point.y
      }
    })
    return bbox
  }

  private static findCommonBorders(firstPath: Path, secondPath: Path) {
    let firstCurrentIndex = 0
    let firstPreviousIndex = -2
    let secondCurrentIndex = 0
    let secondPreviousIndex = -2
    let points: Point[] = []
    let allCommonPoints: Point[][] = []

    firstPath.points.forEach((point: PathPoint, pointIndex) => {
      if (!(point instanceof Point)) {
        // current point is reference to subpath
        // we stop the shared border here
        firstPreviousIndex = -2
        secondPreviousIndex = -2
        return
      }

      firstCurrentIndex = pointIndex
      secondCurrentIndex = PathManager.getPointPosition(secondPath, point)

      if (secondCurrentIndex < 0) {
        // point not in second path found
        // we stop the shared border here
        firstPreviousIndex = -2
        secondPreviousIndex = -2
        return
      }

      let firstCheck = firstPreviousIndex + 1 === firstCurrentIndex
      let secondCheck = secondPreviousIndex + 1 === secondCurrentIndex || secondPreviousIndex - 1 === secondCurrentIndex

      if (firstCheck && secondCheck) {
        // point follows directly in both paths
        points.push(point)
      } else {
        // there has been a gap in either of the paths -> save points up to here
        if (points.length > 0) {
          allCommonPoints.push(points)
          points = []
        }
        points.push(point)
      }

      firstPreviousIndex = firstCurrentIndex
      secondPreviousIndex = secondCurrentIndex
    })

    if (points.length > 0) {
      allCommonPoints.push(points)
    }

    allCommonPoints.forEach((commonPoints: Point[]) => {
      let subPathId: number = PathManager.createSubPath(firstPath, commonPoints)
      PathManager.setSubPath(secondPath, subPathId)
    })
  }

  /**
   * Some counties do not have shared borders. Those paths are transformed into subpaths aswell.
   * @param path transform the given path into subpaths aswell.
   */
  private static reduceMainPathToSubpaths(path: Path) {
    let points: Point[] = []
    let subPathsPoints: Point[][] = []

    path.points.forEach((point: PathPoint, pointIndex: number) => {
      if (!(point instanceof Point)) {
        if (points.length > 2) {
          subPathsPoints.push(points)
        }
        points = []
      } else {
        points.push(point)
      }
    })

    if (points.length > 2) {
      subPathsPoints.push(points)
    }

    subPathsPoints.forEach((subPathPoints: Point[]) => {
      PathManager.createSubPath(path, subPathPoints)
    })
  }

  /**
   * Save reduced points in GeoJSON.
   * @param geoJSON the original data
   * @param iss intermediate data structure
   */
  private static createNewGeoJSON(geoJSON: FeatureCollection, iss: intermediateStruct[]) {
    iss.forEach((is: intermediateStruct) => {
      const feature: Feature = geoJSON.features[is.featureIndex]

      if (is.type === polygonType) {
        const polygon: Polygon = <Polygon>feature.geometry

        polygon.coordinates[is.coordinateIndex] = is.mainPath.points.map((p: PathPoint) => {
          let point: Point = <Point>p
          return [point.x, point.y]
        })
      } else {
        const multiPolygon: MultiPolygon = <MultiPolygon>feature.geometry

        multiPolygon.coordinates[is.ringIndex][is.coordinateIndex] = is.mainPath.points.map((p: PathPoint) => {
          let point: Point = <Point>p
          return [point.x, point.y]
        })
      }
    })
  }
}

const polygonType: string = 'Polygon'
const multiPolygonType = 'MultiPolygon'

export default GeoJSONReduction.recuceGeoJSONPoints
