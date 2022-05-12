import { Notification } from 'electron';
import cron from 'node-cron'
import {v4 as uuid4} from 'uuid'

const reminders: Record<string, cron.ScheduledTask> = {}

const scheduleWeeklyReminder = ({minutes, hours, dayOfWeek}: {minutes: number, hours: number, dayOfWeek: number}) => {
  const cronExpression = `${minutes} ${hours} * * ${dayOfWeek}`

  const reminder = cron.schedule(cronExpression, () => {
      new Notification({ body: "It's time to fill out your hours.", title: "Hey!" }).show()
  });
  const reminderIndex = uuid4()
  console.log("weekly reminder set for", hours, minutes, dayOfWeek, reminderIndex)
  reminders[reminderIndex] = reminder
  return reminderIndex
}

const deleteReminder = (reminderIndex: string) => {
  console.log("reminder deleted", reminderIndex)
  console.log('all reminders', reminders)
  reminders[reminderIndex].stop()
  delete reminders[reminderIndex]
  return reminderIndex
}

export {
  scheduleWeeklyReminder,
  deleteReminder
}