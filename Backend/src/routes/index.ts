import { Router, Request, Response } from "express";
import geodata from "./geodata"
import infections from "./infections"
import settings from "./settings"

const router = Router();

router.use("/geodata")
router.use("/settings")
router.use("/data")

export default router;