import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { getConnection } from 'typeorm'
import { Infections } from '../entity/Infections'
import RkiDataAPI from '../map-data-manager/data-requests/rki-data-request'

class InfectionsController {
  static async infectionData(req: Request, res: Response) {
    let infections
    const query: any = { where: {}}
    if (req.query.blid !== undefined) {
      query.where.blId = req.query.blid
    }
    if (req.query.lkid !== undefined) {
      query.where.lkId = req.query.lkid
    }
    if (req.query.date !== undefined) {
      query.where.date = req.query.date
    } else {
      query.where.date = getCurrentDate()
    }
    console.log(query)
    try {
      infections = await getConnection()
        .getRepository(Infections)
        .find(query)
      res.send(infections)
    } catch (error) {
      console.log(error)
      res.status(401).send('FEHLER')
    }

    //Nur vorrübergehende Lösung bis die Anbundung an die Datenbank fertig ist. So kann das Frontend mit aktuellen Daten arbeiten
    //res.send(await RkiDataAPI.get())
  }

  static async writeInfections() {
    const data: any = await RkiDataAPI.get()
    let bl_id: any
    let bl_name: any
    let lk_id
    let lk_name
    let cases
    let cases_per_100k
    let cases_7_per_100k
    let deaths
    const date = getCurrentDate()
    data.states.forEach((state: any) => {
      bl_id = state.BL_ID
      bl_name = state.name
      state.counties.forEach((county: any) => {
        lk_id = county.LK_ID
        lk_name = county.LK
        cases = county.cases_LK
        cases_per_100k = county.cases_per_100k_LK
        cases_7_per_100k = county.cases7_per_100k_LK
        deaths = county.deaths_LK

      getConnection()
            .createQueryBuilder()
            .insert()
            .into(Infections)
            .values({
              blId: bl_id,
              lkId: lk_id,
              blName: bl_name,
              lkName: lk_name,
              cases: cases,
              casesPer_100k:  cases_per_100k,
              cases_7Per_100k: cases_7_per_100k,
              deaths: deaths,
              date: date
            })
            .execute()
      })
    })
  }
}

function getCurrentDate() {
  const date: Date = new Date()
  let dd: any = date.getDate()
  let mm: any = date.getMonth() + 1
  const yyyy = date.getFullYear()
  dd = (dd < 10 ? '0' + dd : dd)
  mm = (mm < 10 ? '0' + mm : mm)
  return yyyy + '-' + mm + '-' + dd
}

export default InfectionsController
