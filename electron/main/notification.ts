import { Notification } from 'electron'
import { type NotificationIPC } from 'todo-today-utilities'

export const createNotification = ({ title, body }: NotificationIPC) => {
  new Notification({ title, body }).show()
}
