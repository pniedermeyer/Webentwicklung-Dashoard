import { createConnection } from 'typeorm'
import e from 'express'
import * as bodyParser from 'body-parser'
import routes from './routes'
import cors from 'cors'

// writeGeoDataInResolutions()

createConnection()
  .then((connection) => {
    // create and setup express app
    const app = e()
    app.use(cors())
    app.use(bodyParser.json())

    // Set all routes from routes folder
    app.use('/', routes)

    app.listen(3001, () => {
      console.log('Server started on port 3001!')
    })
  })
  .catch((error) => console.log(error))
