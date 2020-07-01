import { FeatureCollection, Feature, Position, Polygon, MultiPolygon } from 'geojson'
import fs from 'fs'
import { Point, SubPath } from './subclasses'
import { BBox, Path, intermediateStruct, PathPoint } from './types'
import PathManager from './path-manager'
import douglasPeucker from '../douglas-peuker'

// const GlobalPoints: any = []

/**
 * Vorgehensweise:
 * Normalerweise würde man jeden Landkreis einzeln betrachten und die Punkte mittels
 * dem douglas-peuker reduzieren. Hierzu kann es aber kommen das Landkreise die nebeneinander
 * liegen auf einmal weiße flächen zwischen sich haben. Um dies zu verhindern wird folgende Methodik
 * angewandt
 *
 * 1. Die GeoJSON wird in ein Zwischenformat überführt. Hier wird sich die entsprechende Position
 * aus der GeoJSON gemerkt sowie der Typ und die darin enthaltenen Punkte. Dadurch kann am Schluss der reduzierte
 * Teil wieder in die korrekte GeoJSON umgewandelt werden. Alle Punkte einen Ladkreises werden beim überführen
 * ins Zwischenformat als Path Objekt abgelegt
 *
 * 2. Nachdem jeder Landkreis im Zwischenformat vorliegt wird jetzt ermittelt welche Landkreise eine gemeinsame Grenze
 * besitzen
 *
 * 3.
 */

class GeoJSONReduction {
  static recuceGeoJSONPoints(geoJSON: FeatureCollection, epsilon: number) {
    // 1. Schritt:
    let iss: intermediateStruct[] = GeoJSONReduction.createIntermediateStructs(geoJSON)

    // 2. Schritt
    GeoJSONReduction.splitIntoCommonBorderLines(iss)

    // x. Schritt
    iss.forEach((is: intermediateStruct) => {
      GeoJSONReduction.reduceMainPathToSubpaths(is.mainPath)
    })

    // y. Schritt
    PathManager.getSubPaths().forEach((subPath: SubPath) => {
      subPath.points = douglasPeucker(subPath.points, epsilon)
    })

    // z. Schritt
    iss.forEach((is: intermediateStruct) => {
      PathManager.buildPath(is.mainPath)
    })

    // Last Step
    GeoJSONReduction.createNewGeoJSON(geoJSON, iss)

    // fs.writeFile('paths.json', JSON.stringify(PathManager.paths, null, 2), function (err) {
    //   if (err) return console.log(err)
    //   console.log('paths > paths.json')
    // })

    // fs.writeFile('subPaths.json', JSON.stringify(PathManager.subPaths, null, 2), function (err) {
    //   if (err) return console.log(err)
    //   console.log('SubPaths > SubPaths.json')
    // })

    return geoJSON
  }

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
        // Aktueller Punkt ist eine Referenz zu einem Subpath
        // Falls bis hierhin eine gemeinsame Grenze gefunden wurde, wird sie hier beendet
        firstPreviousIndex = -2
        secondPreviousIndex = -2
        return
      }

      firstCurrentIndex = pointIndex
      secondCurrentIndex = PathManager.getPointPosition(secondPath, point)

      if (secondCurrentIndex < 0) {
        // Punkt wurde nicht im zweiten Pfad gefunden
        // Falls bis hierhin eine gemeinsame Grenze gefunden wurde, wird sie hier beendet
        firstPreviousIndex = -2
        secondPreviousIndex = -2
        return
      }

      let firstCheck = firstPreviousIndex + 1 === firstCurrentIndex
      let secondCheck = secondPreviousIndex + 1 === secondCurrentIndex || secondPreviousIndex - 1 === secondCurrentIndex

      if (firstCheck && secondCheck) {
        // Punkte folgt direkt vor dem vorherigen sowhol im ersten als auch im zweiten Path
        points.push(point)
      } else {
        // Es gab eine Unterbrechung im ersten oder zweiten Path, daher werden die bisher gemeinsamen Punkte gespeichert
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

    // console.log(allCommonPoints)
    allCommonPoints.forEach((commonPoints: Point[]) => {
      // console.log(commonPoints)
      let subPathId: number = PathManager.createSubPath(firstPath, commonPoints)
      PathManager.setSubPath(secondPath, subPathId)
    })
  }

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
