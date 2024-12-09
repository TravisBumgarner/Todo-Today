import Dexie, { type Table } from 'dexie'
import { type TProject, type TTask, type TTodoListItem, type TWorkspace } from 'types'

// needs to be here for initialization (I think)
export const DEFAULT_WORKSPACE = {
  id: 'default',
  name: 'Todo Today'
}

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>
  tasks!: Table<TTask>
  todoListItems!: Table<TTodoListItem>
  workspaces!: Table<TWorkspace>

  constructor() {
    super('todo-today')
    this.version(14).stores({
      projects: 'id, title, status, createdAt, workspaceId',
      tasks: 'id, projectId, title, status, details, createdAt',
      todoListItems: 'id, taskId, todoListDate, sortOrder, createdAt, workspaceId',
      workspaces: 'id, name'
    })
      .upgrade(async tx => {
        return await Promise.all([
          this.createDefaultWorkspace(),
          tx.table('projects').toCollection().modify(project => {
            project.workspaceId = DEFAULT_WORKSPACE.id
          }),
          tx.table('successes').toCollection().modify(success => {
            success.workspaceId = DEFAULT_WORKSPACE.id
          }),
          tx.table('todoListItems').toCollection().modify(task => {
            task.workspaceId = DEFAULT_WORKSPACE.id
          })

        ])
      })
    this.createDefaultWorkspace().catch(console.error)
  }

  async createDefaultWorkspace() {
    const defaultWorkspace = await this.workspaces.get(DEFAULT_WORKSPACE.id)
    if (!defaultWorkspace) {
      await this.workspaces.add(DEFAULT_WORKSPACE)
    }
  }
}

const db = new MySubClassedDexie()

export default db
