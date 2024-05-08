import { Notification } from 'electron'

class Timer {
  private countdown: NodeJS.Timeout | null = null
  private timeLeft: number = 0

  start(timeInSeconds: number) {
    this.timeLeft = timeInSeconds

    this.countdown = setInterval(() => {
      this.timeLeft--

      if (this.timeLeft <= 0) {
        this.stop()
        new Notification({ title: 'Timer', body: 'Time is up!' }).show()
      }
    }, 1000)
  }

  stop() {
    if (this.countdown) {
      clearInterval(this.countdown)
      this.countdown = null
      return this.timeLeft
    }
  }
}

export default Timer
