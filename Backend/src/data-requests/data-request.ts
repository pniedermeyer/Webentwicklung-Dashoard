import axios from 'axios'

class DataApi {
  /**
   * Template method for getting data from web endpoints via axios
   * 
   * @param request The request object that will be send via axios
   * @param normaliseData The function that will be applied on the data of the response
   */
  static get(request: any, normaliseData: any) {
    return new Promise((resolve, reject) => {
      axios
        .request(request)
        .then((response) => {
          resolve(normaliseData(response.data))
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export default DataApi
