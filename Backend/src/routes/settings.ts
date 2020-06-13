import { Router } from "express";
import SettingsController from "../controllers/SettingsController"

const router = Router()

router.get('/data', SettingsController.settings)

export default router;
