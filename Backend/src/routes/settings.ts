import { Router } from "express";
import SettingsController from "../controllers/SettingsController"

const router = Router()

router.get('/settings', SettingsController.settings)

export default router;
