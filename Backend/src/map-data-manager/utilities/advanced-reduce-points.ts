import { FeatureCollection } from 'geojson'

class GeoJSONReduction {
  private static recuceGeoJSONPoints(geoJSON: FeatureCollection) {}

  private static createIntermediateStructs(geoJson: FeatureCollection) {}
}

const polygon = 'Polygon'
const multiPolygon = 'MultiPolygon'

type intermediateStruct = {
  type: string
  featureIndex: number
  coordinateIndex: number
  ringIndex?: number
  points: Point[]
  bbox: Bbox
  newGraph: newGraph
}

type newGraph = (Point | PathRef)[]

type PathRef = {
  id: number
}

type Bbox = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

type Point = {
  x: number
  y: number
}

type Line = {
  points: Point[]
}

type Path = {
  id: number
  line: Line
}
