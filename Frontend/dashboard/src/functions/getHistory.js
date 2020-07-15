/*
return object: {cases, nueinfektionen, tote, cases7per100k}

*/
import vuexStore from '../store/dataStore.js'

// const pastInfectionData = { ...vuexStore.state.pastInfectionData }

export function getHistoryDeutschland(days) {
  const pastInfectionData = { ...vuexStore.state.pastInfectionData }
  // const days = { ...vuexStore.state.days }
  //let days = 14

  if (days > Object.keys(pastInfectionData).length) {
    days = Object.keys(pastInfectionData).length
  }

  let historyInfectionData = newHistoryInfectionData()
  // console.log(pastInfectionData)

  for (let i = 0; i < days; i++) {
    // console.log(pastInfectionData[i].cases_DE)
    historyInfectionData.cases.unshift(pastInfectionData[i].cases_DE)
    historyInfectionData.change.unshift(pastInfectionData[i].change_DE)
    historyInfectionData.date.unshift(pastInfectionData[i].date)
    historyInfectionData.deaths.unshift(pastInfectionData[i].deaths_DE)
    historyInfectionData.casesPer100k.unshift(Math.round((pastInfectionData[i].cases_per_100k_DE + Number.EPSILON) * 100) / 100)
    historyInfectionData.cases7per100k.unshift(Math.round((pastInfectionData[i].cases7_per_100k_DE + Number.EPSILON) * 100) / 100)
  }
  // console.log(historyInfectionData)
  return historyInfectionData
}

export function getHistoryBL(days, BL_ID) {
  const pastInfectionData = { ...vuexStore.state.pastInfectionData }
  // const days = { ...vuexStore.state.days }

  //let days = 14

  if (days > Object.keys(pastInfectionData).length) {
    days = Object.keys(pastInfectionData).length
  }

  let historyInfectionData = newHistoryInfectionData()

  for (let i = 0; i < days; i++) {
    try {
      let state = pastInfectionData[i].states.find((state) => state.BL_ID === BL_ID)

      historyInfectionData.cases.unshift(state.cases_BL)
      historyInfectionData.change.unshift(state.change_BL)
      historyInfectionData.date.unshift(state.date)
      historyInfectionData.deaths.unshift(state.deaths_BL)
      historyInfectionData.casesPer100k.unshift(Math.round((state.cases_per_100k_BL + Number.EPSILON) * 100) / 100)
      historyInfectionData.cases7per100k.unshift(Math.round((state.cases7_per_100k_BL + Number.EPSILON) * 100) / 100)
    } catch (e) {
      console.error('Error in finding the BL_ID')
    }
  }
  return historyInfectionData
}

export function getHistoryLK(days, BL_ID, LK_ID) {
  const pastInfectionData = { ...vuexStore.state.pastInfectionData }
  // const days = { ...vuexStore.state.days }

  //let days = 14

  if (days > Object.keys(pastInfectionData).length) {
    days = Object.keys(pastInfectionData).length
  }

  let historyInfectionData = newHistoryInfectionData()

  for (let i = 0; i < days; i++) {
    try {
      let state = pastInfectionData[i].states.find((state) => state.BL_ID === BL_ID)
      try {
        let county = state.counties.find((county) => county.LK_ID === LK_ID)
        historyInfectionData.cases.unshift(county.cases_LK)
        historyInfectionData.change.unshift(county.change_LK)
        historyInfectionData.date.unshift(state.date)
        historyInfectionData.deaths.unshift(county.deaths_LK)
        historyInfectionData.casesPer100k.unshift(Math.round((county.cases_per_100k_LK + Number.EPSILON) * 100) / 100)
        historyInfectionData.cases7per100k.unshift(Math.round((county.cases7_per_100k_LK + Number.EPSILON) * 100) / 100)
      } catch (e) {
        console.error('Error in finding the LK_ID')
      }
    } catch (e) {
      console.error('Error in finding the BL_ID')
    }
  }
  return historyInfectionData
}

function newHistoryInfectionData() {
  return {
    cases: [],
    change: [],
    date: [],
    deaths: [],
    casesPer100k: [],
    cases7per100k: [],
  }
}

/* export function getHistoryBundesland(){

}

export function getHistoryLandkreis(){
  
} */

// function fillData(parent) {
//   if (parent.infectionData) {
//     let casesArr = []
//     let cases100kArr = []
//     let cases100k7Arr = []
//     let changeArr = []
//     let deathArr = []
//     switch (parent.view) {
//       case 0:
//         //Deutschand view

//         //Linechart data
//         //Cases data
//         casesArr.push(...parent.pastInfectionData.reverse().map((pid) => pid.cases_DE))
//         casesArr.push(parent.infectionData.cases_DE)

//         //Cases 100K data
//         cases100kArr.push(...parent.pastInfectionData.reverse().map((pid) => pid.cases_per_100k_DE))
//         cases100kArr.push(parent.infectionData.cases_per_100k_DE)
//         cases100kArr = cases100kArr.map((v) => {
//           return Math.round((v + Number.EPSILON) * 100) / 100
//         })

//         //Cases 100k past 7 days data
//         cases100k7Arr.push(...parent.pastInfectionData.reverse().map((pid) => pid.cases7_per_100k_DE))
//         cases100k7Arr.push(parent.infectionData.cases7_per_100k_DE)
//         cases100k7Arr = cases100k7Arr.map((v) => {
//           return Math.round((v + Number.EPSILON) * 100) / 100
//         })

//         //Change data
//         changeArr.push(...parent.pastInfectionData.reverse().map((pid) => pid.change_DE))
//         changeArr.push(parent.infectionData.change_DE)

//         //Death data
//         deathArr.push(...parent.pastInfectionData.reverse().map((pid) => pid.deaths_DE))
//         deathArr.push(parent.infectionData.deaths_DE)

//         parent.data = {
//           name: parent.infectionData.name,
//           cases: parent.infectionData.cases_DE,
//           cases100k: Math.round((parent.infectionData.cases_per_100k_DE + Number.EPSILON) * 100) / 100,
//           cases100k7: Math.round((parent.infectionData.cases7_per_100k_DE + Number.EPSILON) * 100) / 100,
//           changeComparedToYesterday: parent.infectionData.change_DE,
//           deaths: parent.infectionData.deaths_DE,
//           casesArr: casesArr,
//           cases100kArr: cases100kArr,
//           cases100k7Arr: cases100k7Arr,
//           deathArr: deathArr,
//           changeArr: changeArr,
//         }
//         break
//       case 1:
//         //BL view
//         if (parent.BL_ID) {
//           let BLdata = parent.infectionData.states.find((e) => e.BL_ID === parent.BL_ID)

//           //Linechart data
//           //Cases data
//           casesArr.push(...parent.pastInfectionData.reverse().map((pid) => pid.states.find((state) => state.BL_ID === parent.BL_ID).cases_BL))
//           casesArr.push(BLdata.cases_BL)

//           //Cases 100k data
//           cases100kArr.push(
//             ...parent.pastInfectionData.reverse().map((pid) => pid.states.find((state) => state.BL_ID === parent.BL_ID).cases_per_100k_BL)
//           )
//           cases100kArr.push(BLdata.cases_per_100k_BL)
//           cases100kArr = cases100kArr.map((v) => {
//             return Math.round((v + Number.EPSILON) * 100) / 100
//           })

//           //Cases 100k past 7 days data
//           cases100k7Arr.push(
//             ...parent.pastInfectionData.reverse().map((pid) => pid.states.find((state) => state.BL_ID === parent.BL_ID).cases7_per_100k_BL)
//           )
//           cases100k7Arr.push(BLdata.cases7_per_100k_BL)
//           cases100k7Arr = cases100k7Arr.map((v) => {
//             return Math.round((v + Number.EPSILON) * 100) / 100
//           })

//           //Change data
//           changeArr.push(...parent.pastInfectionData.reverse().map((pid) => pid.states.find((state) => state.BL_ID === parent.BL_ID).change_BL))
//           changeArr.push(BLdata.change_BL)

//           //Death data
//           deathArr.push(...parent.pastInfectionData.reverse().map((pid) => pid.states.find((state) => state.BL_ID === parent.BL_ID).deaths_BL))
//           deathArr.push(BLdata.deaths_BL)

//           parent.data = {
//             name: BLdata.name,
//             cases: BLdata.cases_BL,
//             cases100k: Math.round((BLdata.cases_per_100k_BL + Number.EPSILON) * 100) / 100,
//             cases100k7: Math.round((BLdata.cases7_per_100k_BL + Number.EPSILON) * 100) / 100,
//             changeComparedToYesterday: BLdata.change_BL,
//             deaths: BLdata.deaths_BL,
//             casesArr: casesArr,
//             cases100kArr: cases100kArr,
//             cases100k7Arr: cases100k7Arr,
//             deathArr: deathArr,
//             changeArr: changeArr,
//           }
//         } else {
//           empty(parent)
//           parent.data.name = 'Bundesland wählen'
//         }
//         break
//       case 2:
//         //LK view
//         if (parent.BL_ID && parent.LK_ID) {
//           let LKdata = parent.infectionData.states.find((e) => e.BL_ID === parent.BL_ID).counties.find((ee) => ee.LK_ID === parent.LK_ID)

//           //Linechart data
//           //Case data
//           casesArr.push(
//             ...parent.pastInfectionData
//               .reverse()
//               .map(
//                 (pid) => pid.states.find((state) => state.BL_ID === parent.BL_ID).counties.find((county) => county.LK_ID === parent.LK_ID).cases_LK
//               )
//           )
//           casesArr.push(LKdata.cases_LK)

//           //Cases 100k data
//           cases100kArr.push(
//             ...parent.pastInfectionData
//               .reverse()
//               .map(
//                 (pid) =>
//                   pid.states.find((state) => state.BL_ID === parent.BL_ID).counties.find((county) => county.LK_ID === parent.LK_ID).cases_per_100k_LK
//               )
//           )
//           cases100kArr.push(LKdata.cases_per_100k_LK)
//           cases100kArr = cases100kArr.map((v) => {
//             return Math.round((v + Number.EPSILON) * 100) / 100
//           })

//           //Cases 100k past 7 days data
//           cases100k7Arr.push(
//             ...parent.pastInfectionData
//               .reverse()
//               .map(
//                 (pid) =>
//                   pid.states.find((state) => state.BL_ID === parent.BL_ID).counties.find((county) => county.LK_ID === parent.LK_ID).cases7_per_100k_LK
//               )
//           )
//           cases100k7Arr.push(LKdata.cases7_per_100k_LK)
//           cases100k7Arr = cases100k7Arr.map((v) => {
//             return Math.round((v + Number.EPSILON) * 100) / 100
//           })

//           //Change data
//           changeArr.push(
//             ...parent.pastInfectionData
//               .reverse()
//               .map(
//                 (pid) => pid.states.find((state) => state.BL_ID === parent.BL_ID).counties.find((county) => county.LK_ID === parent.LK_ID).change_LK
//               )
//           )
//           changeArr.push(LKdata.change_LK)

//           //Death data
//           deathArr.push(
//             ...parent.pastInfectionData
//               .reverse()
//               .map(
//                 (pid) => pid.states.find((state) => state.BL_ID === parent.BL_ID).counties.find((county) => county.LK_ID === parent.LK_ID).deaths_LK
//               )
//           )
//           deathArr.push(LKdata.deaths_LK)

//           parent.data = {
//             name: LKdata.full_name,
//             cases: LKdata.cases_LK,
//             cases100k: Math.round((LKdata.cases_per_100k_LK + Number.EPSILON) * 100) / 100,
//             cases100k7: Math.round((LKdata.cases7_per_100k_LK + Number.EPSILON) * 100) / 100,
//             changeComparedToYesterday: LKdata.change_LK,
//             deaths: LKdata.deaths_LK,
//             casesArr: casesArr,
//             cases100kArr: cases100kArr,
//             cases100k7Arr: cases100k7Arr,
//             deathArr: deathArr,
//             changeArr: changeArr,
//           }
//         } else {
//           empty(parent)
//         }
//         break
//       default:
//         empty(parent)
//     }
//   } else {
//     empty(parent)
//   }
// }
