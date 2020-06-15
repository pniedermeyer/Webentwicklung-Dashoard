import cron from 'cron'
const { CronJob } = cron

const retrieveData = () => {
  console.log('Retrieve new data!')
}

class Scheduler {
  constructor({ schedule = '*/5 * * * * *' } = {}) {
    this.setSchedule(schedule)
    this._job = null
  }

  setSchedule(schedule) {
    this._schedule = schedule
  }

  start() {
    this._job = this._job ?? createJob(this._schedule)
    if (!this._job.running) {
      this._job.start()
    }

    function createJob(schedule) {
      return new CronJob(schedule, retrieveData)
    }
  }

  stop() {
    if (this._job && this._job.running) {
      this._job.stop()
    }
  }

  executeOutOfSchedule() {
    retrieveData
  }
}

export default Scheduler
