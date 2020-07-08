import { Router } from 'express'
import SettingsController from '../controllers/SettingsController'

/**
 * Router to be used for settings data requests in the express app.
 */
const router = Router()

router.get('/', SettingsController.settings)

export default router
