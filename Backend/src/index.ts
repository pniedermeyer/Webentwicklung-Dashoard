import { createConnection } from 'typeorm'
import e from 'express'
import * as bodyParser from 'body-parser'
import routes from './routes'
import cors from 'cors'
import InfectionsController from './controllers/InfectionsController'
import Scheduler from './utilities/scheduler'
import cleanupInfections from './utilities/infections-cleanup'
import cleanupSettings from './utilities/settings-cleanup'
import { Request, Response, json } from 'express'
import { initGeoData, initInfectionData } from './utilities/initDB'

createConnection()
  .then(async (connection) => {
    // This may throw duplicate key violations but works fine
    InfectionsController.writeInfections()

    // create and setup express app
    const app = e()
    app.use(cors())
    app.use(bodyParser.json())

    // Setup to deliver dashboard website
    app.use('/', e.static(__dirname + '/website'))
    app.get('/', (req: Request, res: Response) => {
      res.sendFile(__dirname + '/website/index.html')
    })
    // Set all routes from routes folder

    app.use('/', routes)

    // Initialize db data (Geo data and Infection data)
    await initInfectionData()
    await initGeoData()

    app.listen(3001, () => {
      console.log('Server started on port 3001!')
      const infectionDataScheduler = new Scheduler(InfectionsController.writeInfections, { schedule: '0 0 1 * * *' })
      infectionDataScheduler.start()
      new Scheduler(cleanupInfections, { schedule: '0 0 4 * * *' }).start()
      new Scheduler(cleanupSettings, { schedule: '0 0 4 * * *' }).start()

      console.log('Scheduler started')
    })
  })
  .catch((error) => console.log(error))
