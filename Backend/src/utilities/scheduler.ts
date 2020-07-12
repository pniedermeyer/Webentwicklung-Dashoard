import { CronJob, CronCommand } from 'cron'

/**
 * Simple scheduler class that can be instantiated with a function and a schedule.
 * The given function will then be executed in the given schedule.
 */
class Scheduler {
  private job: CronJob | null
  private schedule: string = ''
  private jobFunction: Function

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
    if (!this.job.running) {
      this.job.start()
    }
  }

  private createJob(schedule: string) {
    return new CronJob(schedule, <CronCommand>this.jobFunction)
  }

  stop() {
    if (this.job && this.job.running) {
      this.job.stop()
    }
  }

  executeOutOfSchedule() {
<<<<<<< HEAD
    this.jobFunction()
=======
    this.jobFunction;
>>>>>>> 823876cd39390a98676368b1393df88f7753f3fc
  }
}

export default Scheduler
