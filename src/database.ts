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
    this.version(13).stores({
      projects: 'id, title, status, createdAt, workspaceId',
      tasks: 'id, projectId, title, status, details, createdAt',
      todoListItems: 'id, taskId, todoListDate, sortOrder, createdAt, workspaceId',
      successes: 'id, description, date, projectId, createdAt, workspaceId',
      workspaces: 'id, name'
    }).upgrade(async tx => {
      return await Promise.all([
        tx.table('projects').toCollection().modify(project => {
          project.workspaceId = DEFAULT_WORKSPACE_ID
        }),
        tx.table('successes').toCollection().modify(success => {
          success.workspaceId = DEFAULT_WORKSPACE_ID
        }),
        this.createDefaultWorkspace()
      ])
    })
  }

  async createDefaultWorkspace() {
    const defaultWorkspace = await this.workspaces.get(DEFAULT_WORKSPACE_ID)
    if (!defaultWorkspace) {
      await this.workspaces.add({ id: DEFAULT_WORKSPACE_ID, name: 'Todo Today' })
    }
  }
}

const db = new MySubClassedDexie()

export default db
