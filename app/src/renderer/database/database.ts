import { Dexie, type Table } from 'dexie'
import type { TRecurringTask, TTask, TTodoList } from '../types'

class MySubClassedDexie extends Dexie {
  tasks!: Table<TTask>
  todoList!: Table<TTodoList>
  recurringTasks!: Table<TRecurringTask>

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

    // Add recurring tasks table
    this.version(3).stores({
      tasks: 'id, title, status, details, subtask',
      todoList: 'date',
      recurringTasks: 'id, title, frequency, status',
    })

    // Set type field to 'regular' for all existing tasks
    this.version(4)
      .stores({
        tasks: 'id, title, status, details, subtask, type',
        todoList: 'date',
        recurringTasks: 'id, title, frequency, status',
      })
      .upgrade(async (tx) => {
        return await tx
          .table('tasks')
          .toCollection()
          .modify((task) => {
            task.type = 'regular'
          })
      })

    // Add processedRecurringTasks field to todoList and recurringTaskId to tasks
    this.version(5)
      .stores({
        tasks: 'id, title, status, details, subtask, type, recurringTaskId',
        todoList: 'date, processedRecurringTasks',
        recurringTasks: 'id, title, frequency, status',
      })
      .upgrade(async (tx) => {
        return await tx
          .table('todoList')
          .toCollection()
          .modify((todoList) => {
            todoList.processedRecurringTasks = false
          })
      })
  }
}

const db = new MySubClassedDexie()

export default db
