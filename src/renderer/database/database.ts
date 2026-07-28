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

    // Subtasks are gone: fold each one into details as a rich-text checklist
    // item so nothing the user wrote is lost.
    this.version(6)
      .stores({
        tasks: 'id, title, status, details, type, recurringTaskId',
        todoList: 'date, processedRecurringTasks',
        recurringTasks: 'id, title, frequency, status',
      })
      .upgrade(async (tx) => {
        return await tx
          .table('tasks')
          .toCollection()
          .modify((task) => {
            const subtasks: LegacySubtask[] = task.subtasks ?? []
            if (subtasks.length > 0) {
              task.details = (task.details ?? '') + subtasks.map(subtaskToChecklistItem).join('')
            }
            delete task.subtasks
          })
      })
  }
}

interface LegacySubtask {
  id: string
  title: string
  checked: boolean
}

/**
 * Mirrors what RichTextEditor writes when you make a checkbox line: a
 * non-editable span carrying its state in data-checked, wrapped in a block so
 * the "line-through when checked" rule has an element to match on. Subtask
 * titles were already stored as HTML, so they drop straight in.
 */
const subtaskToChecklistItem = (subtask: LegacySubtask) =>
  `<div><span class="rte-check" contenteditable="false" data-checked="${subtask.checked}"></span>&nbsp;${subtask.title}</div>`

const db = new MySubClassedDexie()

export default db
