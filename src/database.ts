import Dexie, { type Table } from 'dexie'
import { type TTask, type TTodoListItem } from 'types'

class MySubClassedDexie extends Dexie {
  tasks!: Table<TTask>
  todoListItems!: Table<TTodoListItem>

  constructor() {
    super('todo-today')
    this.version(14).stores({
      tasks: 'id, title, status, details, createdAt',
      todoListItems: 'id, taskId, todoListDate, sortOrder, createdAt'
    })
  }
}

const db = new MySubClassedDexie()

export default db
