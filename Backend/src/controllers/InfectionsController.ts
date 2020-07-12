import { Request, Response } from 'express'
import { getConnection, MoreThanOrEqual } from 'typeorm'
import { Infections } from '../entity/Infections'
import { InfectionsDE } from '../entity/InfectionsDE'
import RkiDataAPI from '../data-requests/rki-data-request'
import DateUtil from '../utilities/DateUtil'
import { InfectionsBL } from '../entity/InfectionsBL'
import { InfectionsLK } from '../entity/InfectionsLK'
import { Inflate } from 'zlib'

class InfectionsController {
  /**
   * Loads the infection data from the database and sends it back via the respone object
   *
   * @param req Request object from express
   * @param res Response object from express
   */
  static async infectionData(req: Request, res: Response) {
    let infections
    let date: Date = new Date(DateUtil.getCurrentDate())
    let numberOfPreviousDays: number = <number>(<unknown>req.query.numberOfPreviousDays) ?? 0
    date.setDate(date.getDate() - numberOfPreviousDays)
    // const query: any = {
    //   where: [
    //     {
    //       date: DateUtil.getCurrentDate(),
    //     },
    //     {
    //       date: DateUtil.getYesterdayDate(),
    //     },
    //   ],
    // }
    try {
      //   const loadedPosts = await connection.getRepository(Post).find({
      //     likes: MoreThanOrEqual(10)
      // });

      infections = await getConnection()
        .getRepository(InfectionsDE)
        .find({
          date: MoreThanOrEqual(date.toDateString()),
        })

      infections = infections.concat(
        await getConnection()
          .getRepository(InfectionsBL)
          .find({
            date: MoreThanOrEqual(date.toDateString()),
          })
      )

      infections = infections.concat(
        await getConnection()
          .getRepository(InfectionsLK)
          .find({
            date: MoreThanOrEqual(date.toDateString()),
          })
      )

      // console.log(infections)

      // infections = await getConnection().getRepository(Infections).find(query)
      const data = normalizeData(infections)
      res.send(data)
    } catch (error) {
      console.log(error)
      res.status(401).send('Error')
    }
  }

  static async writeInfections() {
    const data: any = await RkiDataAPI.get()
    let count = await getConnection()
      .getRepository(InfectionsDE)
      .count({ where: { date: data.date } })

    if (count > 0) {
      console.log('Already inserted: Retry in one hour')
      setTimeout(() => {
        this.writeInfections()
      }, 3600000)
      return
    }

    getConnection()
      .createQueryBuilder()
      .insert()
      .into(InfectionsDE)
      .values({
        date: data.date,
        cases: data.cases_DE,
        casesPer_100k: data.cases_per_100k_DE,
        cases_7Per_100k: data.cases7_per_100k_DE,
        newCases: data.new_cases_DE,
        deaths: data.deaths_DE,
        recovered: data.recovered_DE,
      })
      .execute()

    data.states.forEach((state: any) => {
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
          newCases: state.new_cases_BL,
          deaths: state.deaths_BL,
          recovered: state.recovered_BL,
        })
        .execute()

      state.counties.forEach((county: any) => {
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
            newCases: county.new_cases_LK,
            deaths: county.deaths_LK,
            recovered: county.recovered_LK,
          })
          .execute()
      })
    })
  }

  // static async writeInfections2() {
  //   const data: any = await RkiDataAPI.get()
  //   return
  //   let bl_id: any
  //   let bl_name: any
  //   let lk_id
  //   let lk_name
  //   let cases
  //   let cases_per_100k
  //   let cases_7_per_100k
  //   let casesPer_100k_bl
  //   let deaths
  //   const date = DateUtil.getCurrentDate()
  //   data.states.forEach((state: any) => {
  //     bl_id = state.BL_ID
  //     bl_name = state.name
  //     state.counties.forEach((county: any) => {
  //       lk_id = county.LK_ID
  //       lk_name = county.LK
  //       cases = county.cases_LK
  //       cases_per_100k = county.cases_per_100k_LK
  //       cases_7_per_100k = county.cases7_per_100k_LK
  //       casesPer_100k_bl = 0 // todo:lraubuch

  //       deaths = county.deaths_LK

  //       getConnection()
  //         .createQueryBuilder()
  //         .insert()
  //         .into(Infections)
  //         .values({
  //           blId: bl_id,
  //           lkId: lk_id,
  //           blName: bl_name,
  //           lkName: lk_name,
  //           cases: cases,
  //           casesPer_100k: cases_per_100k,
  //           cases_7Per_100k: cases_7_per_100k,
  //           casesPer_100k_bl,
  //           deaths: deaths,
  //           date: date,
  //         })
  //         .execute()
  //     })
  //   })
  // }
}

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
        new_cases_DE: infection.newCases,
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
          new_cases_BL: infection.newCases,
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
          new_cases_LK: infection.newCases,
        })
    }
  })
  return data
}

function normalizeData2(infections: any) {
  let currentDate: string = DateUtil.getCurrentDate()
  let newFormat: any = {
    name: 'Deutschland',
    cases_DE: 0,
    deaths_DE: 0,
    cases_per_100k_DE: 0,
    cases7_per_100k_DE: 0,
    recovered_DE: 0,
    change_DE: 0,
    new_cases_DE: 0,
    states: new Array(16),
  }

  newFormat.states = infections
    .filter((county: any) => county.date === currentDate)
    .reduce((acc: any, county: Infections) => {
      const index: number = county.blId - 1
      if (!acc[index]) {
        acc[index] = {
          BL_ID: county.blId,
          name: county.blName,
          cases_BL: 0,
          deaths_BL: 0,
          cases_per_100k_BL: 0,
          cases7_per_100k_BL: 0,
          recovered_BL: 0,
          change_BL: 0,
          new_cases_BL: 0,
          counties: [],
        }
      }
      const state = acc[index]
      const prevDay = getPrevDay(county.blId, county.lkId, infections, currentDate)
      let change_LK = county.cases
      if (prevDay !== undefined && prevDay !== null) {
        change_LK = county.cases - prevDay.cases
      }
      const newCounty = {
        LK_ID: county.lkId,
        LK: county.lkName,
        GEN: county.lkName,
        cases_LK: county.cases,
        deaths_LK: county.deaths,
        cases_per_100k_LK: county.casesPer_100k,
        cases7_per_100k_LK: county.cases_7Per_100k,
        recovered_LK: 0,
        change_LK: change_LK,
        new_cases_LK: 0,
      }
      state.counties[county.lkId - 1] = newCounty

      state.cases_BL += newCounty.cases_LK
      state.deaths_BL += newCounty.deaths_LK
      state.cases_per_100k_BL += newCounty.cases_per_100k_LK
      state.cases7_per_100k_BL += newCounty.cases7_per_100k_LK
      state.recovered_BL += newCounty.recovered_LK
      state.change_BL += newCounty.change_LK
      state.new_cases_BL += newCounty.new_cases_LK

      newFormat.cases_DE += newCounty.cases_LK
      newFormat.deaths_DE += newCounty.deaths_LK
      newFormat.cases_per_100k_DE += newCounty.cases_per_100k_LK
      newFormat.cases7_per_100k_DE += newCounty.cases7_per_100k_LK
      newFormat.recovered_DE += newCounty.recovered_LK
      newFormat.change_DE += newCounty.change_LK
      newFormat.new_cases_DE += newCounty.new_cases_LK

      return acc
    }, newFormat.states)
  return newFormat
}

function getPrevDay(blId: number, lkId: number, data: any, currentDate: string): any {
  for (const infection of data) {
    if (blId === infection.blId && lkId === infection.lkId && currentDate !== infection.date) {
      return infection
    }
  }
}

export default InfectionsController
