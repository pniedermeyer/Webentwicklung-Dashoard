<<<<<<< HEAD
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { Infections } from "../entity/Infections"

class InfectionsController{
    static infectionData = async (req: Request, res: Response) => {
        let infections
        try {
            infections = await getConnection().getRepository(Infections).find();
        } catch (error) {
            res.status(401).send();
        }
        res.send(infections)
    }
}
=======
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { Infections } from "../entity/Infections"

class InfectionsController{
    static infectionData = async (req: Request, res: Response) => {
        let infections
        try {
            infections = await getConnection().getRepository(Infections).find();
        } catch (error) {
            res.status(401).send();
        }
        res.send(infections)
    }
}
>>>>>>> 7a911962b405c5f8cdd259627e59e882666e2a19
export default InfectionsController;