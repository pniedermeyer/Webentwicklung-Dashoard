import axios from 'axios'

class DataApi {
  static get(request, normaliseData) {
    return new Promise((resolve, reject) => {
      axios.request(request).then((response) => {
        resolve(normaliseData(response.data))
      })
    })
  }
}

export default DataApi
