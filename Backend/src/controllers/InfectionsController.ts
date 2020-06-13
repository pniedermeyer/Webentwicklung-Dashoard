import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import Infection from "../entities/Infection"

class InfectionsController{
    static infectionData = async (Request, Response) => {
         return getConnection().getRepository(Infection).find();
    }
}
export default InfectionsController;