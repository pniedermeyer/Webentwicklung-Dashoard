import { Router } from 'express'
import InfectionsController from '../controllers/InfectionsController'

/**
 * Router to be used for infections data requests in the express app.
 */
const router = Router()

router.get('/', InfectionsController.infectionData)

export default router
