import { Router } from "express";
import InfectionsController from "controller/InfectionsController"

const router = Router()

router.get('/data', InfectionsController.getInfections)

export default router;
