import Dexie, { type Table } from 'dexie'
import { type TProject, type TSuccess, type TTask, type TTodoListItem } from 'sharedTypes'

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>

  tasks!: Table<TTask>

  todoListItems: Table<TTodoListItem>

  successes: Table<TSuccess>

  constructor() {
    super('todo-today')
    this.version(3).stores({
      projects: '[id], id, title, status',
      tasks: '[id], id, projectId, title, status',
      todoListItems: '[id], id, projectId, taskId, todoListDate, [sortOrder]',
      successes: '[id], id, description, date, projectId'
    })
  }
}

const db = new MySubClassedDexie()

export default db
