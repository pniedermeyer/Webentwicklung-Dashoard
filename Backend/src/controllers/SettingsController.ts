import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import Settings from "../entities/Settings"

class SettingsController{
    static settings = async (Request, Response) => {
         return getConnection().getRepository(Settings).find();
    }
}
export default SettingsController;