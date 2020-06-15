import { createConnection } from 'typeorm'
import { Request, Response } from 'express'
import e from 'express'
import * as bodyParser from 'body-parser'
import * as dbrequests from './database/db-request/db-requests'
import routes from './routes/geodata'

createConnection()
  .then((connection) => {
    // create and setup express app
    const app = e()

    app.use(bodyParser.json())

    // Set all routes from routes folder
    app.use('/', routes)

    app.listen(3000, () => {
      console.log('Server started on port 3000!')
    })
  })
  .catch((error) => console.log(error))
