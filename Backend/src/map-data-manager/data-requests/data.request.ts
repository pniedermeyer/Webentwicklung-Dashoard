import axios from 'axios'

class DataApi {
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
