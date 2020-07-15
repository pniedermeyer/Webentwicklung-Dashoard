import { Router } from 'express'
import geodata from './geodata'
import infections from './infections'
import settings from './settings'

/**
 * Base router to be used in the express app.
 * Contains all of the routers for different url paths.
 */
const router = Router()

router.use('/geodata', geodata)
router.use('/settings', settings)
router.use('/data', infections)

export default router
