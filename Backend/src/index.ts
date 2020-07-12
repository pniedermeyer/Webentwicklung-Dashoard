import { createConnection } from 'typeorm'
import e from 'express'
import * as bodyParser from 'body-parser'
import routes from './routes'
import cors from 'cors'
import InfectionsController from './controllers/InfectionsController'
import Scheduler from './utilities/scheduler'
import GeoDataController from './controllers/GeodataController'
import cleanupInfections from './utilities/infections-cleanup'
import cleanupSettings from './utilities/settings-cleanup'

createConnection()
  .then((connection) => {
    // todo
    InfectionsController.writeInfections()

    // create and setup express app
    const app = e()
    app.use(cors())
    app.use(bodyParser.json())

    // Set all routes from routes folder
    app.use('/', routes)

    GeoDataController.initDB()

    app.listen(3001, () => {
      console.log('Server started on port 3001!')
      const infectionDataScheduler = new Scheduler(InfectionsController.writeInfections, { schedule: '0 0 1 * * *' })
      infectionDataScheduler.start()
      new Scheduler(cleanupInfections, {schedule: '0 0 2 * * *'}).start();
      new Scheduler(cleanupSettings, {schedule: '0 0 2 * * *'}).start();

      console.log('Scheduler started')
    })
  })
  .catch((error) => console.log(error))
