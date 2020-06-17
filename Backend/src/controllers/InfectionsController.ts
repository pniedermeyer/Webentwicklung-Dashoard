import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { getConnection } from 'typeorm'
import { Infections } from '../entity/Infections'
import RkiDataAPI from '../map-data-manager/data-requests/rki-data-request'

class InfectionsController {
  static async infectionData(req: Request, res: Response) {
    let infections
    try {
      //   infections = await getConnection()
      //     .getRepository(Infections)
      //     .find({ where: { blId: req.query.blid, lkId: req.query.lkid, date: req.query.date } })
      //   res.send(infections)
    } catch (error) {
      console.log(error)
      res.status(401).send('FEHLER')
    }

    //Nur vorrübergehende Lösung bis die Anbundung an die Datenbank fertig ist. So kann das Frontend mit aktuellen Daten arbeiten
    res.send(await RkiDataAPI.get())
  }

  static async writeInfections(date: String) {
    let data: any = await RkiDataAPI.get()
  }
}

export default InfectionsController
