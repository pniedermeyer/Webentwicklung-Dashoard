import { Router } from "express";
import GeoDataController from "controller/GeoDataController"

const router = Router();

router.get('/geo-data', GeoDataController.getGeoData);

export default router;
