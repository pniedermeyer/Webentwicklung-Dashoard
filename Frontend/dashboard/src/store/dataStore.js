import Vue from 'vue'
import Vuex from 'vuex'

import { getField, updateField } from 'vuex-map-fields'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Global items
    BL_ID: 0,
    LK_ID: 0,
    casesOption: 'cases7_per_100k',
    allCasesOptions: [
      { label: 'Alle', code: 'cases' },
      { label: '100k', code: 'cases_per_100k' },
      { label: '100k / 7 Tage', code: 'cases7_per_100k' },
    ],
    infectionData: {},
    //Settings
    visibleComponents: {
      casesGermanyVisible: true,
      casesStateVisible: true,
      casesCountyVisible: true,
      barchartvisible: true,
      mapVisible: true,
      lineChartVisible: true,
    },
    //Past Data
    pastInfectionData: [],
    //Base Color
    baseColor: 'Coral',
    // Table items
    tableSelectedItemsID: [[2, 6], [], [0, 20, 40]],
    tableTab: 0,
    // Barchart
    barsShown: 5,
    // Map items
    mapZoom: 5,
    mapPosition: [51.9, 10.26], // Lat, Lng // Middlepoint of Germany
<<<<<<< HEAD
    mapResolution: 2, // lowest Resolution
    //Linechart
    numberPastDays: 5,
=======
    mapResolution: 3, // lowest Resolution
>>>>>>> 13dc560388d36a469d1418ed6b4e53cfb42909ef
    // Linechart Dialog
    lineChartDialogConfig: { data: [], label: '', shown: false, dates: [] }, // Config for Chart Dialog
  },
  getters: {
    getField,
  },
  mutations: {
    updateField,
    setFields(state, payload) {
      for (const changedFieldName of Object.keys(payload)) {
        if (changedFieldName in state) {
          if (state[changedFieldName] !== payload[changedFieldName]) {
            state[changedFieldName] = payload[changedFieldName]
          }
        } else {
          console.warn('Tried to update a non-existing property in the vuex state: ' + changedFieldName)
        }
      }
    },
  },
})
