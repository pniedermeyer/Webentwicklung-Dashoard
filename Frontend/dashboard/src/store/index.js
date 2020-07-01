import Vue from 'vue'
import Vuex from 'vuex'

import { getField, updateField } from 'vuex-map-fields'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    graphsShown: 5,
    selectedBL_ID: 0,
    selectedLK_ID: 0,
    selectedCaseOptions: 'cases7_per_100k',
    selectedItemsID: [[2, 6], [], [0, 20, 40]],
    tab: 0
  },
  getters: {
    // Add the `getField` getter to the
    // `getters` of your Vuex store instance.
    getField
  },
  mutations: {
    // Add the `updateField` mutation to the
    // `mutations` of your Vuex store instance.
    updateField,
    setFields (state, payload) {
      for (let changedFieldName of Object.keys(payload)) {
        if (changedFieldName in state) {
          if (state[changedFieldName] !== payload[changedFieldName]) {
            state[changedFieldName] = payload[changedFieldName]
          }
        } else {
          console.warn("Tried to update a non-existing property in the vuex state: "+changedFieldName)
        }
      }
    }
  }
})
