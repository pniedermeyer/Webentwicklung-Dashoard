<<<<<<< HEAD
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { GeoData } from "../entity/GeoData"

class GeoDataController{
    static geoData = async (req: Request, res: Response) => {
        let geoData; GeoData;
        try {
            geoData = await getConnection().getRepository(GeoData).find();
        } catch (error) {
            res.status(401).send();
        }
        res.send(geoData)
    }
}
=======
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { GeoData } from "../entity/GeoData"

class GeoDataController{
    static geoData = async (req: Request, res: Response) => {
        let geoData; GeoData;
        try {
            geoData = await getConnection().getRepository(GeoData).find();
        } catch (error) {
            res.status(401).send();
        }
        res.send(geoData)
    }
}
>>>>>>> 7a911962b405c5f8cdd259627e59e882666e2a19
export default GeoDataController;