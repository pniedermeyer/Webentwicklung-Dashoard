import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import GeoData from "../entities/GeoData"

class GeoDataController{
    static geoData =async (Request, Response) => {
        return getConnection().getRepository(GeoData).find();
    }
}
export default GeoDataController;