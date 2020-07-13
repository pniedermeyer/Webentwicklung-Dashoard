import vuexStore from '../store/dataStore.js'

vuexStore.subscribe(() => {
  // TODO: comment this in -> updateUserUrl()
})

/**
 * Updates the URL in the browser, so that it contains the current configuration of the webapp
 * This will also update the history-object, so that the user can undo a change by clicking on the back button
 * The configuration will be stored in the "hash" part of the URL, so that it is shareable
 */
export function updateUserUrl (doStatePush = true) {
  alert("updateUserUrl("+doStatePush+")")

  // const state = Object.entries(vuexStore.state)
  const state = filterData({ ...vuexStore.state })

  if (doStatePush) {
    window.history.pushState(state, '_THIS_IS_NOT_USED_CURRENTLY_', '#' + JSON.stringify(state))
  }
}

function filterData(d) {
  if (d === null || d === undefined) {
    return d;
  }

  delete d.infectionData
  delete d.allCasesOptions
  delete d.pastInfectionData

  return d;
}

// TODO: Extremely lazy way to do this, there should be something better
function arrayEquals(a1, a2) {
  return JSON.stringify(a1) === JSON.stringify(a2)
}

export function storeListener(mutation, state) {
  if (mutation.type !== 'updateField') {
    // Data change wasn't triggered by data binding, ignore
    return;
  }

  state = filterData({... state})

  // This should already be filtered, by just to be sure
  let urlData = filterData(parseUrlState(window.location))

  let changedfileds = generateDeltaObject(state, urlData)
  let onlyLkChanged = Object.keys(changedfileds).includes('LK_ID') && Object.keys(changedfileds).length === 1
  console.log("State: ", state)
  console.log("Prev.: ", urlData)
  console.log("Chan.: ", changedfileds)
  console.log("onlyLkChanged: "+onlyLkChanged)

  if (Object.keys(changedfileds).length === 0) {
    // No data changed, no updates needed
    return
  }

  if (onlyLkChanged && (changedfileds.LK_ID === null || changedfileds.LK_ID === undefined || changedfileds.LK_ID === 0)) {
    // LK_ID change was triggered by change of BL_ID. Do not push a new URL state for this!
    updateUserUrl(false)
    return;
  }

  updateUserUrl()
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

    updateUserUrl(false);
  })
}

function generateDeltaObject(d1, d2) {
  if (d1 === null || d1 === undefined || d2 === null || d2 === undefined) {
    return {};
  }

  let output = {};

  for (const changedFieldName of Object.keys(d1)) {
    if (!arrayEquals(d1[changedFieldName], d2[changedFieldName])) {
      output[changedFieldName] = d1[changedFieldName];
    }

    /*
    if (d1[changedFieldName] instanceof Array && !arrayEquals(d1[changedFieldName], d2[changedFieldName])) {
      output[changedFieldName] = d1[changedFieldName];
    } else if (d1[changedFieldName] !== d2[changedFieldName]) {
      output[changedFieldName] = d1[changedFieldName];
    }
    */
  }

  return output;
}
