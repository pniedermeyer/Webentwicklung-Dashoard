import { CronJob, CronTime } from 'cron'

class Scheduler {
  private job: CronJob
  private schedule: string
  private jobFunction: any

  constructor(jobFunction: any, { schedule = '*/5 * * * * *' } = {}) {
    this.setSchedule(schedule)
    this.job = null
    this.jobFunction = jobFunction
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
      return new CronJob(schedule, this.jobFunction)
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
