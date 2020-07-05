import vuexStore from '../store/dataStore.js'

vuexStore.subscribe(() => {
  // TODO: comment this in -> updateUserUrl()
})

/**
 * Updates the URL in the browser, so that it contains the current configuration of the webapp
 * This will also update the history-object, so that the user can undo a change by clicking on the back button
 * The configuration will be stored in the "hash" part of the URL, so that it is shareable
 */
export function updateUserUrl () {
  // const state = Object.entries(vuexStore.state)
  const state = { ...vuexStore.state }
  delete state.infectionData
  delete state.allCasesOptions

  window.history.pushState(state, '_THIS_IS_NOT_USED_CURRENTLY_', '#' + JSON.stringify(state))
}

/**
 * Updates the URL in the browser, so that it contains the current configuration of the webapp
 */
export function urlToSettingsChange (settings) {
  if (!(settings)) {
    return
  }

  vuexStore.commit('setFields', settings)
}

export function parseUrlState (url) {
  try {
    var userState = decodeURIComponent(url.hash.substring(1))
    return JSON.parse(userState)
  } catch (e) {
    return null
  }
}

/**
 * Adds an event listener for the "popstate" event, indicating the use of the navigation buttons
 * in the browser or
 */
export function registerURLEventListener () {
  window.addEventListener('popstate', function (event) {
    urlToSettingsChange(
      parseUrlState(event.currentTarget.location)
    )
  })
}
