import { Router } from "express";
import SettingsController from "../controllers/settings-controller";

const router = Router();

router.get("/", SettingsController.get.authorize, SettingsController.get.handler);
router.put("/", SettingsController.put.authorize, SettingsController.put.handler);

export default router;
