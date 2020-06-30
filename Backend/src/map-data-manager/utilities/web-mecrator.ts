// calculate coordinates
class WebMercator {
  static calculateX(zoomLevel: number, longitude: number) {
    return (256 / 2) * Math.PI * Math.pow(2, zoomLevel) * (longitude + Math.PI)
  }

  static calculateY(zoomLevel: number, latitude: number) {
    return (256 / 2) * Math.PI * Math.pow(2, zoomLevel) * (Math.PI - Math.log(Math.tan(Math.PI / 4 + latitude / 2)))
  }
}

export default WebMercator
