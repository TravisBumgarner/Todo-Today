import Dexie, { type Table } from 'dexie'
import { type TProject, type TSuccess, type TTask, type TTodoListItem } from 'types'

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>

  tasks!: Table<TTask>

  todoListItems!: Table<TTodoListItem>

  successes!: Table<TSuccess>

  constructor() {
    super('todo-today')
    this.version(7).stores({
      projects: 'id, title, status',
      tasks: 'id, projectId, title, status, details',
      todoListItems: 'id, taskId, todoListDate, sortOrder',
      successes: 'id, description, date, projectId'
    })
  }
}

const db = new MySubClassedDexie()

export default db
