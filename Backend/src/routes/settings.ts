import { Router } from "express";
import SettingsController from "controller/SettingsController"

const router = Router()

router.get('/data', SettingsController.getSettings)

export default router;
