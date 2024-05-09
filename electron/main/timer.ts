import { Notification } from 'electron'

class Timer {
  private countdown: NodeJS.Timeout | null = null
  public timerDuration: number = 0
  private initialTime: number = 0
  private isPaused: boolean = false
  private readonly tickCallback: (tick: number) => void

  constructor(callback: (timerDuration: number) => void) {
    this.tickCallback = callback
  }

  start(timeInSeconds: number) {
    this.timerDuration = timeInSeconds
    this.initialTime = timeInSeconds

    this.countdown = setInterval(() => {
      if (!this.isPaused) {
        this.timerDuration--
        this.tickCallback(this.timerDuration)
        console.log('I calle')

        if (this.timerDuration <= 0) {
          this.stop()
          new Notification({ title: 'Timer', body: 'Time is up!' }).show()
        }
      }
    }, 1000)
  }

  stop() {
    if (this.countdown) {
      clearInterval(this.countdown)
      this.countdown = null
      return this.timerDuration
    }
  }

  pause() {
    this.isPaused = true
  }

  resume() {
    this.isPaused = false
  }

  restart() {
    this.stop()
    this.start(this.initialTime)
  }
}

export default Timer
