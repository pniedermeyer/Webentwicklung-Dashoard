import { CronJob, CronTime } from 'cron'

const retrieveData = () => {
  console.log('Retrieve new data!')
}

class Scheduler {
  private job: CronJob
  private schedule: string

  constructor({ schedule = '*/5 * * * * *' } = {}) {
    this.setSchedule(schedule)
    this.job = null
  }

  setSchedule(schedule: string) {
    this.schedule = schedule
  }

  start() {
    this.job = this.job ?? createJob(this.schedule)
    if (!this.job.running) {
      this.job.start()
    }

    function createJob(schedule: string) {
      return new CronJob(schedule, retrieveData)
    }
  }

  stop() {
    if (this.job && this.job.running) {
      this.job.stop()
    }
  }

  executeOutOfSchedule() {
    retrieveData
  }
}

export default Scheduler
