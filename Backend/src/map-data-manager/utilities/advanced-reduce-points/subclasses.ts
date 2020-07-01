export class Point {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  equals(point: Point) {
    return this.x === point.x && this.y === point.y
  }
}

export interface SubPathRef {
  id: number
  reverse: boolean
}

export interface SubPath {
  id: number
  points: Point[]
}
