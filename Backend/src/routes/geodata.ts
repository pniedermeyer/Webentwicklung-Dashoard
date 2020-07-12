import { Router } from 'express'
import GeoDataController from '../controllers/GeodataController'

/**
 * Router to be used for geo data requests in the express app.
 */
const router = Router()

router.get('/', GeoDataController.geoData)

export default router
