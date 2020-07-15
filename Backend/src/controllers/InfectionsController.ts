import { Request, Response } from 'express'
import { getConnection, MoreThanOrEqual } from 'typeorm'
import { InfectionsDE } from '../entity/InfectionsDE'
import RkiDataAPI from '../data-requests/rki-data-request'
import DateUtil from '../utilities/DateUtil'
import { InfectionsBL } from '../entity/InfectionsBL'
import { InfectionsLK } from '../entity/InfectionsLK'

class InfectionsController {
  /**
   * Loads the infection data from the database and sends it back via the respone object
   *
   * @param req Request object from express
   * @param res Response object from express
   */
  static async infectionData(req: Request, res: Response) {
    let infections: (InfectionsDE | InfectionsBL | InfectionsLK)[]
    let date: Date = new Date(DateUtil.getCurrentDate())
    let numberOfPreviousDays: number = <number>(<unknown>req.query.numberOfPreviousDays) ?? 0
    numberOfPreviousDays = Number.isInteger(Math.round(numberOfPreviousDays)) && numberOfPreviousDays >= 0 ? numberOfPreviousDays : 0
    date.setDate(date.getDate() - numberOfPreviousDays)
    try {
      // load infections data for germany
      infections = await getConnection()
        .getRepository(InfectionsDE)
        .find({
          date: MoreThanOrEqual(date.toDateString()),
        })

      //sort by date
      infections.sort((a: any, b: any) => {
        return <number>(<unknown>new Date(b.date)) - <number>(<unknown>new Date(a.date))
      })
      // load infections data for the states
      infections = infections.concat(
        await getConnection()
          .getRepository(InfectionsBL)
          .find({
            date: MoreThanOrEqual(date.toDateString()),
          })
      )
      // load infections data for the counties
      infections = infections.concat(
        await getConnection()
          .getRepository(InfectionsLK)
          .find({
            date: MoreThanOrEqual(date.toDateString()),
          })
      )

      const data = normalizeData(infections)
      res.send(data)
    } catch (error) {
      console.log(error)
      res.status(401).send('Error')
    }
  }

  /**
   * Request infections data from RKI and persists it to the database.
   */
  static async writeInfections() {
    const data: any = await RkiDataAPI.get()
    let count = await getConnection()
      .getRepository(InfectionsDE)
      .count({ where: { date: data.date } })

    let prevDayDate: Date = new Date(data.date)
    prevDayDate.setDate(prevDayDate.getDate() - 1)

    if (count > 0) {
      console.log('Already inserted: Retry in one hour')
      setTimeout(() => {
        this.writeInfections()
      }, 3600000)
      return
    }

    let prevDayDataDE: InfectionsDE[] = await getConnection()
      .getRepository(InfectionsDE)
      .find({ where: { date: prevDayDate.toDateString() } })

    let prevDayDataBL: InfectionsBL[] = await getConnection()
      .getRepository(InfectionsBL)
      .find({ where: { date: prevDayDate.toDateString() } })

    let prevDayDataLK: any = await getConnection()
      .getRepository(InfectionsLK)
      .find({ where: { date: prevDayDate.toDateString() } })

    let changeDE = prevDayDataDE[0] !== undefined ? prevDayDataDE[0].cases : data.cases_DE
    changeDE = data.cases_DE - changeDE

    // Save infections for germany overall
    getConnection()
      .createQueryBuilder()
      .insert()
      .into(InfectionsDE)
      .values({
        date: data.date,
        cases: data.cases_DE,
        casesPer_100k: data.cases_per_100k_DE,
        cases_7Per_100k: data.cases7_per_100k_DE,
        change: changeDE,
        deaths: data.deaths_DE,
        recovered: data.recovered_DE,
      })
      .execute()

    // Save infections for each state
    data.states.forEach((state: any) => {
      let pastStateData = prevDayDataBL.find((bl: InfectionsBL) => bl.id === state.blId)
      let changeBL = pastStateData !== undefined ? pastStateData.cases : state.cases_BL
      changeBL = state.cases_BL - changeBL
      getConnection()
        .createQueryBuilder()
        .insert()
        .into(InfectionsBL)
        .values({
          id: state.blId,
          name: state.name,
          date: data.date,
          cases: state.cases_BL,
          casesPer_100k: state.cases_per_100k_BL,
          cases_7Per_100k: state.cases7_per_100k_BL,
          change: changeBL,
          deaths: state.deaths_BL,
          recovered: state.recovered_BL,
        })
        .execute()
      // Save infections for each county
      state.counties.forEach((county: any) => {
        let pastCountyData = prevDayDataLK.find((lk: InfectionsLK) => lk.lkId === county.lkId)
        let changeLK = pastCountyData !== undefined ? pastCountyData.cases : county.cases_LK
        changeLK = county.cases_LK - changeLK
        getConnection()
          .createQueryBuilder()
          .insert()
          .into(InfectionsLK)
          .values({
            lkId: county.lkId,
            blId: state.blId,
            date: data.date,
            fullName: county.fullName,
            givenName: county.givenName,
            cases: county.cases_LK,
            casesPer_100k: county.cases_per_100k_LK,
            cases_7Per_100k: county.cases7_per_100k_LK,
            change: changeLK,
            deaths: county.deaths_LK,
            recovered: county.recovered_LK,
          })
          .execute()
      })
    })
  }
}

/**
 * Transform data from the database into the format that was specified from frontend.
 * @param infections Array of rows from the database tables
 */
function normalizeData(infections: (InfectionsDE | InfectionsBL | InfectionsLK)[]) {
  let data: any = []

  infections.forEach((infection: InfectionsDE | InfectionsBL | InfectionsLK) => {
    if (infection instanceof InfectionsDE) {
      data.push({
        name: 'Deutschland',
        date: infection.date,
        cases_DE: infection.cases,
        deaths_DE: infection.deaths,
        cases_per_100k_DE: infection.casesPer_100k,
        cases7_per_100k_DE: infection.cases_7Per_100k,
        recovered_DE: infection.recovered,
        change_DE: infection.change,
        states: [],
      })
    }

    if (infection instanceof InfectionsBL) {
      data
        .find((data: any) => data.date === infection.date)
        .states.push({
          BL_ID: infection.id,
          date: infection.date,
          name: infection.name,
          cases_BL: infection.cases,
          deaths_BL: infection.deaths,
          cases_per_100k_BL: infection.casesPer_100k,
          cases7_per_100k_BL: infection.cases_7Per_100k,
          recovered_BL: infection.recovered,
          change_BL: infection.change,
          counties: [],
        })
    }

    if (infection instanceof InfectionsLK) {
      data
        .find((ger: any) => ger.date === infection.date)
        .states.find((bl: any) => bl.BL_ID === infection.blId)
        .counties.push({
          LK_ID: infection.lkId,
          BL_ID: infection.blId,
          full_name: infection.fullName,
          given_name: infection.givenName,
          cases_LK: infection.cases,
          deaths_LK: infection.deaths,
          cases_per_100k_LK: infection.casesPer_100k,
          cases7_per_100k_LK: infection.cases_7Per_100k,
          recovered_LK: infection.recovered,
          change_LK: infection.change,
        })
    }
  })
  return data
}

export default InfectionsController
