import GeoDataController from '../controllers/GeodataController'

function writeGeoDataInResolutions () {
  GeoDataController.writeGeoDataInResolution('low')
  GeoDataController.writeGeoDataInResolution('medium')
  GeoDataController.writeGeoDataInResolution('high')
}

export default writeGeoDataInResolutions
