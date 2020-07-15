import axios from 'axios'
import {getCurrentUrlDataState} from "./UrlSettings";

/**
 * Sends the given user data to the backend server and calls the callback functions accordingly to the result
 * @param settingsId ID for accessing/storing the user settings
 * @param settings Settings to store
 * @param onSuccess If the backend server sends a result with a HTTP code between 200 and 299 this function will be called
 * @param onError On any other HTTP code, as well as other exceptions
 */
export function sendUserSettingsToServer(settingsId, settings, onSuccess = function(){}, onError = function(){}) {
  axios.put("http://localhost:3001/settings", getCurrentUrlDataState(), {
    headers: {
      'x-guid': settingsId
    }
  }).then(result =>
      onSuccess(result.data)
  ).catch(result =>
      onError(result)
  )
}

/**
 * Receives the given user data from the backend server and calls the callback functions accordingly to the result
 * @param settingsId ID for accessing the user settings
 * @param onSuccess If the backend server sends a result with a HTTP code between 200 and 299 this function will be called
 * @param onError On any other HTTP code, as well as other exceptions
 */
export function readUserDataFromServer(settingsId, onSuccess = function(){}, onError = function(){}) {
  axios.get("http://localhost:3001/settings", {
    headers: {
      'x-guid': settingsId
    }
  }).then(result =>
      onSuccess(result.data)
  ).catch(result =>
      onError(result)
  )
}

/**
 * Generates an 11 characters long ID for storing data
 * @returns {string}
 */
export function generateShortId() {
  return Math.random().toString(36).slice(2)
}

/**
 * Puts the given settingsId in the URL, replacing the settings-JSon if applicable
 * @param currentUrl URL which should get the settingsId information
 * @param settingsId The settings-ID to append
 * @returns {string} The generated URL
 */
export function generateUrlWithSettingsId(currentUrl, settingsId) {
  let completeUrl = currentUrl.toString()
  let hashLocation = completeUrl.indexOf('#')
  if (hashLocation <= 0) {
    hashLocation = completeUrl.length;
  }
  let baseUrl = completeUrl.slice(0, hashLocation);

 return  baseUrl + "#" + settingsId;
}

/**
 * Copies the given text into the clipboard of the user
 * @param text
 */
export function copyTextToClipboard(text) {
  alert("Copy text")
  navigator.clipboard.writeText(text)
}
