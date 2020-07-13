import { Router } from 'express'
import SettingsController from '../../controllers/settings-controller'
import paramValidator from '../../middleware/param-validator'
import getBodySchema from './get-body.schema.json'
import putBodySchema from './put-body.schema.json'

/**
 * Router to be used for settings data requests in the express app.
 */
const router = Router()

router.get('/',
  SettingsController.get.authorize,
  paramValidator(getBodySchema, 'body'),
  SettingsController.get.handler)

router.put('/',
  SettingsController.put.authorize,
  paramValidator(putBodySchema, 'body'),
  SettingsController.put.handler)

export default router
