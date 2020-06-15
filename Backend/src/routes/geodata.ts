import { Router } from 'express'
import GeoDataController from '../controllers/GeodataController'

const router = Router()

router.get('/geo-data', GeoDataController.geoData)

export default router
