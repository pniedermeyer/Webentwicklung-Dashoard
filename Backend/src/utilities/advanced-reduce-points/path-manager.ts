import { Path, PathPoint } from './types'
import { SubPath, Point, SubPathRef } from './subclasses'

export default class PathManager {
  private static pathId: number = 0
  private static subPathId: number = 0
  public static paths: Path[] = []
  public static subPaths: SubPath[] = []

  static createNewPath(points: Point[]): Path {
    const path = {
      id: PathManager.pathId++,
      points: points,
    }
    PathManager.paths.push(path)
    return path
  }

  static setSubPath(path: Path, id: number) {
    const subPath = PathManager.subPaths[id]

    const subPathRef: SubPathRef = {
      id: subPath.id,
      reverse: false,
    }

    // special case where subpath only has one point
    if (subPath.points.length < 2) {
      let index = PathManager.getPointPosition(path, subPath.points[0])
      path.points.splice(index, 1, subPath.points[0], subPathRef, subPath.points[0])
      return
    }

    let firstIndex: number = PathManager.getPointPosition(path, subPath.points[0])
    let secondIndex: number = PathManager.getPointPosition(path, subPath.points[1])
    let penultimateIndex: number = PathManager.getPointPosition(path, subPath.points[subPath.points.length - 2])
    let lastIndex: number = PathManager.getPointPosition(path, subPath.points[subPath.points.length - 1])
    let length: number = 0

    if (firstIndex < 0 || secondIndex < 0 || penultimateIndex < 0 || lastIndex < 0) {
      console.log(path, subPath)
    }

    // subpath is present in path
    if (firstIndex < secondIndex && penultimateIndex < lastIndex && firstIndex < lastIndex) {
      length = lastIndex - firstIndex + 1

      let firstPoint = subPath.points[0]
      let lastPoint = subPath.points[subPath.points.length - 1]

      path.points.splice(firstIndex, length, firstPoint, subPathRef, lastPoint)
      return
    }

    // subpath is present in reverse in path 
    if (firstIndex > secondIndex && penultimateIndex > lastIndex) {
      length = firstIndex - lastIndex + 1

      let firstPoint = subPath.points[0]
      let lastPoint = subPath.points[subPath.points.length - 1]

      subPathRef.reverse = true
      path.points.splice(lastIndex, length, lastPoint, subPathRef, firstPoint)
      return
    }

    // subpath begins at the end and stops at the start but runs forward nevertheless
    if (firstIndex < secondIndex && penultimateIndex < lastIndex && firstIndex > lastIndex) {
      path.points.splice(firstIndex, path.points.length)

      let firstPoint = subPath.points[0]
      let lastPoint = subPath.points[subPath.points.length - 1]
      lastIndex++
      path.points.splice(0, lastIndex, firstPoint, subPathRef, lastPoint)
      return
    }

    // subpath begins at the front and ends at the end but runs backwards
    if (firstIndex > secondIndex && lastIndex < penultimateIndex) {
      path.points.splice(lastIndex, path.points.length)

      let firstPoint = subPath.points[0]
      let lastPoint = subPath.points[subPath.points.length - 1]
      subPathRef.reverse = true
      firstIndex++
      path.points.splice(0, firstIndex, lastPoint, subPathRef, firstPoint)
      return
    }
  }

  static createSubPath(path: Path, points: Point[]): number {
    const subPath: SubPath = {
      id: PathManager.subPathId++,
      points: points,
    }

    PathManager.subPaths.push(subPath)

    const subPathRef: SubPathRef = {
      id: subPath.id,
      reverse: false,
    }

    let firstIndex = PathManager.getPointPosition(path, points[0])
    let lastIndex = PathManager.getPointPosition(path, points[points.length - 1])

    firstIndex++
    lastIndex--
    let length = lastIndex - firstIndex + 1

    path.points.splice(firstIndex, length, subPathRef)
    return subPath.id
  }

  static getPointPosition(path: Path, point: Point) {
    return path.points.findIndex((entry: PathPoint) => {
      if (entry instanceof Point) {
        const p: Point = <Point>entry
        return p.equals(point)
      }
      return false
    })
  }

  static getSubPaths(): SubPath[] {
    return PathManager.subPaths
  }

  static buildPath(path: Path) {
    for (let i = 0; i < path.points.length; ++i) {
      let point: PathPoint = path.points[i]
      if (!(point instanceof Point)) {
        const subPathRef = <SubPathRef>point
        const subPath = PathManager.subPaths[subPathRef.id]

        if (subPathRef.reverse) {
          path.points.splice(i, 1, ...subPath.points.reverse())
        } else {
          path.points.splice(i, 1, ...subPath.points)
        }
      }
    }

    path.points = path.points.filter((point: PathPoint, index: number) => {
      const nextPoint = <Point>path.points[index + 1]
      const currentPoint = <Point>point
      return nextPoint === undefined || !currentPoint.equals(nextPoint)
    })
    path.points.push(path.points[0])
  }
}
