import * as Counties from './constants/map-data-manager-constants'
import GeoDataAPI from './data-requests/geo-data-request'
import Scheduler from './scheduler/scheduler'
import RkiDataAPI from './data-requests/rki-data-request'

class MapDataManager {
  private settings = {
    dataRefreshInterval: '*/5 * * * *',
    resolutions: {
      low: '0.001',
      medium: '0.0001',
      high: '0',
    },
  }

  private static instance: MapDataManager
  private static scheduler: Scheduler

  public counties: any = Counties

  constructor() {
    this.counties = Counties
    MapDataManager.scheduler = new Scheduler(this.updateData, { schedule: this.settings.dataRefreshInterval })
  }

  private updateData() {
    console.log('Update data')
  }

  /**
   * creates a new MapDataManager instance if none exists, otherwise returns the existing one
   */
  static getInstance(): MapDataManager {
    if (!MapDataManager.instance) {
      MapDataManager.instance = new MapDataManager()
    }

    return MapDataManager.instance
  }

  startDataScheduler(): void {
    MapDataManager.scheduler.start()
  }

  stopDataScheduler(): void {
    MapDataManager.scheduler.stop()
  }

  setSettings({ dataRefreshInterval = this.settings.dataRefreshInterval, resolutions = this.settings.resolutions } = {}): void {
    const originalInterval = this.settings.dataRefreshInterval
    this.settings = { dataRefreshInterval, resolutions }
    if (originalInterval !== this.settings.dataRefreshInterval) {
      MapDataManager.scheduler.stop()
      MapDataManager.scheduler.setSchedule(this.settings.dataRefreshInterval)
      MapDataManager.scheduler.start()
    }
  }

  getData({ fromDate = '', toDate = '', county = [Counties.ALL], resolution = this.settings.resolutions.high } = {}) {
    console.log('getData()')
    return RkiDataAPI.get()
  }

  getGeoData({ county = [Counties.ALL] } = {}) {
    return GeoDataAPI.get()
  }

  /**
   * forces a refresh of the current data
   * -> creates new requests to the API endpoints to get the newest data
   */
  forceDataRefresh() {
    console.log('OutOfSchedule()')
    MapDataManager.scheduler.executeOutOfSchedule()
  }

  /**
   * update the svg data in the backend (in case data is missing or incorrect)
   */
  updateGeoDate() {}
}

export default MapDataManager.getInstance()
