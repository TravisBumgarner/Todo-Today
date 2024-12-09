import Dexie, { type Table } from 'dexie'
import { type TTask, type TTodoListItem, type TWorkspace } from 'types'

// needs to be here for initialization (I think)
export const DEFAULT_WORKSPACE = {
  id: 'default',
  name: 'Todo Today'
}

class MySubClassedDexie extends Dexie {
  tasks!: Table<TTask>
  todoListItems!: Table<TTodoListItem>
  workspaces!: Table<TWorkspace>

  constructor() {
    super('todo-today')
    this.version(14).stores({
      tasks: 'id, title, status, details, createdAt',
      todoListItems: 'id, taskId, todoListDate, sortOrder, createdAt, workspaceId',
      workspaces: 'id, name'
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
