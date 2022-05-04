// db.ts
import Dexie, { Table } from 'dexie';

import { TProject, TTask, TTodoListItem } from 'sharedTypes';

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>; 
  tasks!: Table<TTask>; 
  todoListItems: Table<TTodoListItem>

  constructor() {
    super('todo-today');
    this.version(1).stores({
      projects: '[id], id, title, startDate, endDate, status',
      tasks: '[id], id, projectId, title, status',
      todoListItems: '[id], id, duration, projectId, taskId, todoListDate'
    });
  }
}

const db = new MySubClassedDexie();

export default db