import * as Counties from './constants/map-data-manager-constants.js'
import Scheduler from './scheduler/scheduler.js'

let settings = {
  dataRefreshInterval: '*/5 * * * *',
  resolutions: {
    low: '0.001',
    medium: '0.0001',
    high: '0',
  },
}

class MapDataManager {
  constructor() {
    this.counties = Counties
  }
  /**
   * creates a new MapDataManager instance if none exists, otherwise returns the existing one
   */
  static getInstance() {
    return mapDataManagerInstance
  }

  startDataScheduler() {
    scheduler.start()
  }

  stopDataScheduler() {
    scheduler.stop()
  }

  setSettings({ dataRefreshInterval = settings.dataRefreshInterval, resolutions = settings.resolutions } = {}) {
    const originalInterval = settings.dataRefreshInterval
    settings = { dataRefreshInterval, resolutions }
    if (originalInterval !== settings.dataRefreshInterval) {
      scheduler.stop()
      scheduler.setSchedule(settings.dataRefreshInterval)
      scheduler.start()
    }
  }

  getData({ fromDate = '', toDate = '', county = [Counties.ALL], resolution = settings.resolutions.high } = {}) {
    console.log('getData()')
  }

  /**
   * forces a refresh of the current data
   * -> creates new requests to the API endpoints to get the newest data
   */
  forceDataRefresh() {
    console.log('OutOfSchedule()')
    scheduler.executeOutOfSchedule()
  }

  /**
   * update the svg data in the backend (in case data is missing or incorrect)
   */
  updateGeoDate() {}
}

const mapDataManagerInstance = new MapDataManager()
const scheduler = new Scheduler(settings.dataRefreshInterval)

export default MapDataManager.getInstance()
