<<<<<<< HEAD
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { Settings } from "../entity/Settings"

class SettingsController{
    static settings = async (req: Request, res: Response) => {
        let settings
        try {
            settings = await getConnection().getRepository(Settings).find();
        } catch (error) {
            res.status(401).send();
        }
        res.send(settings);
    }
}
=======
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { Settings } from "../entity/Settings"

class SettingsController{
    static settings = async (req: Request, res: Response) => {
        let settings
        try {
            settings = await getConnection().getRepository(Settings).find();
        } catch (error) {
            res.status(401).send();
        }
        res.send(settings);
    }
}
>>>>>>> 7a911962b405c5f8cdd259627e59e882666e2a19
export default SettingsController;