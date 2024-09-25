import Dexie, { type Table } from 'dexie'
import { type TProject, type TSuccess, type TTask, type TTodoListItem, type TWorkspace } from 'types'
import { DEFAULT_WORKSPACE_ID } from 'utilities'

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>
  tasks!: Table<TTask>
  todoListItems!: Table<TTodoListItem>
  successes!: Table<TSuccess>
  workspaces!: Table<TWorkspace>

  constructor() {
    super('todo-today')
    this.version(11).stores({
      projects: 'id, title, status, createdAt, workspaceId',
      tasks: 'id, projectId, title, status, details, createdAt',
      todoListItems: 'id, taskId, todoListDate, sortOrder, createdAt',
      successes: 'id, description, date, projectId, createdAt, workspaceId',
      workspaces: 'id, name'
    }).upgrade(async tx => {
      return await Promise.all([
        tx.table('projects').toCollection().modify(project => {
          project.workspace = DEFAULT_WORKSPACE_ID
        }),
        tx.table('successes').toCollection().modify(success => {
          success.workspace = DEFAULT_WORKSPACE_ID
        })
      ])
    })
  }
}

const db = new MySubClassedDexie()

export default db
