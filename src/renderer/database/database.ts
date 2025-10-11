import { Dexie, type Table } from 'dexie'
import { type TTask, type TTodoList } from '../types'

class MySubClassedDexie extends Dexie {
  tasks!: Table<TTask>
  todoList!: Table<TTodoList>

  constructor() {
    super('todo-today')
    this.version(2)
      .stores({
        tasks: 'id, title, status, details, subtask',
        todoList: 'date',
      })
      .upgrade(async (tx) => {
        return await tx
          .table('tasks')
          .toCollection()
          .modify((task) => {
            task.subtasks = []
          })
      })
  }
}

const db = new MySubClassedDexie()

export default db
