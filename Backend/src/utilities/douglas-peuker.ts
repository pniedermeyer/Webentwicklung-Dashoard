import { Point } from './advanced-reduce-points/subclasses'

class Line {
  private p1: Point
  private p2: Point

  constructor(p1: Point, p2: Point) {
    this.p1 = p1
    this.p2 = p2
  }

  getDistance(point: Point): number {
    let x: number = this.p1.x
    let y: number = this.p1.y
    let dx: number = this.p2.x - x
    let dy: number = this.p2.y - y

    if (dx !== 0 || dy !== 0) {
      const t = ((point.x - x) * dx + (point.y - y) * dy) / (dx * dx + dy * dy)

      if (t > 1) {
        x = this.p2.x
        y = this.p2.y
      } else if (t > 0) {
        x += dx * t
        y += dy * t
      }
    }

    dx = point.x - x
    dy = point.y - y

    return dx * dx + dy * dy
  }
}

function simplifyDPStep(points: Point[], first: number, last: number, epsilon: number, simplified: Point[]) {
  let maxDistance = epsilon
  let index = 0
  const line = new Line(points[first], points[last])

  for (var i = first + 1; i < last; i++) {
    const sqDist = line.getDistance(points[i])

    if (sqDist > maxDistance) {
      index = i
      maxDistance = sqDist
    }
  }

  if (maxDistance > epsilon) {
    if (index - first > 1) simplifyDPStep(points, first, index, epsilon, simplified)
    simplified.push(points[index])
    if (last - index > 1) simplifyDPStep(points, index, last, epsilon, simplified)
  }
}

function douglasPeucker(points: Point[], epsilon: number): Point[] {
  const last: number = points.length - 1
  const reducedPoints: Point[] = [points[0]]
  simplifyDPStep(points, 0, last, epsilon, reducedPoints)
  reducedPoints.push(points[last])

  return reducedPoints
}

export default douglasPeucker
