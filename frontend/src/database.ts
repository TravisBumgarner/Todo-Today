// db.ts
import Dexie, { Table } from 'dexie'

import { TProject, TSuccess, TTask, TTodoListItem } from 'sharedTypes'

class MySubClassedDexie extends Dexie {
    projects!: Table<TProject>

    tasks!: Table<TTask>

    todoListItems: Table<TTodoListItem>

    successes: Table<TSuccess>

    constructor() {
        super('todo-today')
        this.version(1).stores({
            projects: '[id], id, title, status',
            tasks: '[id], id, projectId, title, status',
            todoListItems: '[id], id, projectId, taskId, todoListDate',
            successes: '[id], id, description, date, projectId'
        })
    }
}

const db = new MySubClassedDexie()

export default db
