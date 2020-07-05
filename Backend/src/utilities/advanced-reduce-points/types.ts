import { Point, SubPathRef } from './subclasses'

export type PathPoint = Point | SubPathRef

export type Path = {
  id: number
  points: PathPoint[]
}

export type BBox = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export type commonBorderPoints = {
  firstIndex: number
  secondIndex: number
}

export type GraphEntry = Point | SubPathRef

export type intermediateStruct = {
  type: string
  featureIndex: number
  coordinateIndex: number
  ringIndex: number
  //   points: Point[]
  bbox: BBox
  mainPath: Path
}
