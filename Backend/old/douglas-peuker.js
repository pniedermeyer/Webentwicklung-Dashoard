const douglasPeucker = function (points, epsilon) {
  // square distance from a point to a segment

  class Line {
    constructor(p1, p2) {
      this.p1 = p1
      this.p2 = p2
    }

    getDistance(point) {
      let x = this.p1.x
      let y = this.p1.y
      let dx = this.p2.x - x
      let dy = this.p2.y - y

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

  function simplifyDPStep(points, first, last, epsilon, simplified) {
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

  const last = points.length - 1
  const reducedPoints = [points[0]]
  simplifyDPStep(points, 0, last, epsilon, reducedPoints)
  reducedPoints.push(points[last])

  return reducedPoints
}

export default douglasPeucker
