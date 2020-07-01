import { commonBorderPoints, Path, GraphEntry } from './types'
import { Point, SubPath, SubPathRef } from './subclasses'

export default class Graph {
  public points: GraphEntry[]
  public pointLength: number
  public cbis: commonBorderPoints[][]
  public fpaths: Path[]
  public spaths: Path[]
  constructor(points: Point[]) {
    this.points = points
    this.cbis = []
    this.pointLength = this.points.length
    this.fpaths = []
    this.spaths = []
  }

  findCommonBorder(graph: Graph) {
    const cbis: commonBorderPoints[] = []
    this.points.forEach((entry: GraphEntry, index: number) => {
      if (entry instanceof Point) {
        const point: Point = <Point>entry
        const pIndex = graph.getPointPosition(point)
        if (pIndex > -1) {
          let cbi: commonBorderPoints = { firstIndex: index, secondIndex: pIndex }
          cbis.push(cbi)
        }
      }
    })
    if (cbis !== []) {
      let firstCurrentIndex = 0
      let firstPreviousIndex = -2
      let secondCurrentIndex = 0
      let secondPreviousIndex = -2
      let path: Path

      cbis.forEach((cbi: commonBorderPoints) => {
        firstCurrentIndex = cbi.firstIndex
        secondCurrentIndex = cbi.secondIndex

        let firstCheck = firstPreviousIndex + 1 === firstCurrentIndex
        let secondCheck = secondPreviousIndex + 1 === secondCurrentIndex || secondPreviousIndex - 1 === secondCurrentIndex
        // if (firstCheck && secondCheck) {
        //   //continue the current common border
        //   path.line.points.push(<Point>this.points[firstCurrentIndex])
        // } else {
        //   path = PathManager.createNewPath()
        //   path.line.points.push(<Point>this.points[firstCurrentIndex])
        //   //create a new common border path and close the previouse one
        // }

        firstPreviousIndex = firstCurrentIndex
        secondPreviousIndex = secondCurrentIndex
      })
      this.cbis.push(cbis)
    }
  }

  getPointPosition(point: Point): number {
    return this.points.findIndex((entry: GraphEntry) => {
      if (entry instanceof Point) {
        const p: Point = <Point>entry
        return p.equals(point)
      }
      return false
    })
  }
}
