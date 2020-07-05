/**
 * Calculates the Maximum cases for the infection data of a state
 */
export function evaluateMaxData (parent) {
  parent.infectionData.states.forEach((state) => {
    state.counties.forEach((county) => {
      parent.maxCases.maxCasesLk = county.cases_LK > parent.maxCases.maxCasesLk ? county.cases_LK : parent.maxCases.maxCasesLk
      parent.maxCases.maxCasesPer100kLk =
        county.cases_per_100k_LK > parent.maxCases.maxCasesPer100kLk ? county.cases_per_100k_LK : parent.maxCases.maxCasesPer100kLk
      parent.maxCases.max7CasesPer100kLk =
        county.cases7_per_100k_LK > parent.maxCases.max7CasesPer100kLk ? county.cases7_per_100k_LK : parent.maxCases.max7CasesPer100kLk
    })
  })
}

/**
* Returns the Top X Countys for a given County set based on the case option (All, 100k, 100k7) for a given
* Array of countys
*/
export function selectTopCounty (topXCountys, states, infectionData, caseOption) {
  const arrTopCountys = []
  const countys = selectCounty(states, infectionData, caseOption)
  if (topXCountys > countys.length) {
    topXCountys = countys.length
  }

  for (let i = 0; i < topXCountys; i++) {
    arrTopCountys.push(countys[i])
  }
  return arrTopCountys
}

function selectCounty (states, infectionData, caseOption) {
  const selectetCounty = []

  // If "All" states are selected
  if (states === 0) {
    infectionData.states.forEach((state) => {
      state.counties.forEach((county) => {
        selectetCounty.push(county)
      })
    })
  } else {
    infectionData.states.forEach((state) => {
      if (state.BL_ID === states) {
        state.counties.forEach((county) => {
          selectetCounty.push(county)
        })
      }
    })
  }
  let sortedSelectetCounty = []
  switch (caseOption) {
    case 'cases':
      sortedSelectetCounty = selectetCounty.slice(0)
      sortedSelectetCounty.sort(function (a, b) {
        return a.cases_LK - b.cases_LK
      })
      break
    case 'cases7_per_100k':
      sortedSelectetCounty = selectetCounty.slice(0)
      sortedSelectetCounty.sort(function (a, b) {
        return a.cases7_per_100k_LK - b.cases7_per_100k_LK
      })
      break
    default:
      sortedSelectetCounty = selectetCounty.slice(0)
      sortedSelectetCounty.sort(function (a, b) {
        return a.cases_per_100k_LK - b.cases_per_100k_LK
      })
  }
  return sortedSelectetCounty.reverse()
}
