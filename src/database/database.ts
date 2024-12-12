import Dexie, { type Table } from 'dexie'
import { type TTask, type TTodoList } from 'types'

class MySubClassedDexie extends Dexie {
  tasks!: Table<TTask>
  todoList!: Table<TTodoList>

  constructor() {
    super('todo-today')
    this.version(1).stores({
      tasks: 'id, title, status, details',
      todoList: 'date'
    })
  }
}

const db = new MySubClassedDexie()

export default db
