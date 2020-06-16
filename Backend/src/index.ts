import { createConnection } from 'typeorm'
import { Request, Response } from 'express'
import e from 'express'
import * as bodyParser from 'body-parser'
import * as dbrequests from './database/db-request/db-requests'
import routes from './routes'
import mapDataManager from './map-data-manager/map-data-manager'
import { rp } from './controllers/GeodataController'
import cors from 'cors'

const app = e()

app.use(cors())

app.get('/geo-data', (req, res) => {
  console.log('/geo-data')
  // res.json({ test: 'test' })
  mapDataManager.getGeoData().then((data) => {
    let d = rp(data, 0.00003)
    res.send(d)
  })
})

app.listen(3000, () => {
  console.log('Server started on port 3000!')
})

// createConnection()
//   .then((connection) => {
//     // create and setup express app
//     const app = e()

//     app.use(bodyParser.json())

//     // Set all routes from routes folder
//     app.use('/', routes)

//     app.listen(3000, () => {
//       console.log('Server started on port 3000!')
//     })
//   })
//   .catch((error) => console.log(error))
