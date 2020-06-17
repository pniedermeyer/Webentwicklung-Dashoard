import { Router } from 'express'
import InfectionsController from '../controllers/InfectionsController'

const router = Router()

router.get('/', InfectionsController.infectionData)

export default router
