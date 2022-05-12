import { Notification } from 'electron';
import cron from 'node-cron'
import {v4 as uuid4} from 'uuid'
import { AddReminderIPC, RefreshRemindersIPC } from '../../shared/types';

const reminders: Record<string, cron.ScheduledTask> = {}

const addReminder = ({minutes, hours, dayOfWeek}: AddReminderIPC) => {
  const cronExpression = `${minutes} ${hours} * * ${dayOfWeek}`

  const reminder = cron.schedule(cronExpression, () => {
      new Notification({ body: "It's time to fill out your hours.", title: "Hey!" }).show()
  });
  const reminderIndex = uuid4()
  reminders[reminderIndex] = reminder
  return reminderIndex
}

const refreshReminders = (reminders: RefreshRemindersIPC) => {
  return reminders.map(({minutes, hours, dayOfWeek}) => {
    const reminderIndex = addReminder({minutes, hours, dayOfWeek})
    return {
      reminderIndex,
      minutes,
      hours,
      dayOfWeek
    }
  })
  
}

const deleteReminder = (reminderIndex: string) => {
  reminders[reminderIndex].stop()
  delete reminders[reminderIndex]
  return reminderIndex
}

export {
  addReminder,
  deleteReminder,
  refreshReminders
}