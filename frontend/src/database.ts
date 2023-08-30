import Dexie, { type Table } from 'dexie'
import { type TProject, type TSuccess, type TTask, type TTodoListItem } from 'sharedTypes'

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>

  tasks!: Table<TTask>

  todoListItems: Table<TTodoListItem>

  successes: Table<TSuccess>

  constructor() {
    super('todo-today')
    this.version(5).stores({
      projects: 'id, title, status',
      tasks: 'id, projectId, title, status',
      todoListItems: 'id, projectId, taskId, todoListDate, sortOrder',
      successes: 'id, description, date, projectId'
    })
  }
}

const db = new MySubClassedDexie()

export default db
