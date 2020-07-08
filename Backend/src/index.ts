import { createConnection } from 'typeorm'
import e from 'express'
import * as bodyParser from 'body-parser'
import routes from './routes'
import cors from 'cors'
import InfectionsController from './controllers/InfectionsController'
import Scheduler from './utilities/scheduler'

createConnection()
  .then((connection) => {
    // After starting the backend we first try to get the current data
    InfectionsController.writeInfections()
    // create and setup express app
    const app = e()
    app.use(cors())
    app.use(bodyParser.json())

    // Set all routes from routes folder
    app.use('/', routes)

    app.listen(3001, () => {
      console.log('Server started on port 3001!')
      const infectionDataScheduler = new Scheduler(InfectionsController.writeInfections, { schedule: '0 0 1 * * *' })
      infectionDataScheduler.start()
      console.log('Scheduler started')
    })
  })
  .catch((error) => console.log(error))
