import { CronJob, CronTime, CronCommand } from 'cron'

class Scheduler {
  private job: CronJob | null
  private schedule: string = ''
  private jobFunction: CronCommand

  constructor(jobFunction: any, { schedule = '*/5 * * * * *' } = {}) {
    this.setSchedule(schedule)
    this.jobFunction = jobFunction
    this.job = null
  }

  setSchedule(schedule: string) {
    this.schedule = schedule
  }

  start() {
    if (this.job === null) {
      this.job = this.createJob(this.schedule)
    }
    // this.job = this.job ?? this.createJob(this.schedule)
    if (!this.job.running) {
      this.job.start()
    }
  }

  private createJob(schedule: string) {
    return new CronJob(schedule, this.jobFunction)
  }

  stop() {
    if (this.job && this.job.running) {
      this.job.stop()
    }
  }

  executeOutOfSchedule() {
    this.jobFunction
  }
}

export default Scheduler
