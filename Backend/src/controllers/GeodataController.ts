import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { GeoData } from "../entity/GeoData"

class GeoDataController{
    static geoData = async (req: Request, res: Response) => {
        let geoData; GeoData;
        try {
            geoData = await getConnection().getRepository(GeoData).find();
            console.log("test")
        } catch (error) {
            res.status(401).send();
        }
        res.send(geoData)
    }
}
export default GeoDataController;