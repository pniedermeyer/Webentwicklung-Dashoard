import { Router, Request, Response } from "express";
import geodata from "./geodata"
import infections from "./infections"
import settings from "./settings"

const router = Router();

router.use("/geodata", geodata)
router.use("/settings", settings)
router.use("/data", infections)

export default router;