import { Router } from 'express'
import SettingsController from '../controllers/SettingsController'

const router = Router()

router.get('/', SettingsController.settings)

export default router
