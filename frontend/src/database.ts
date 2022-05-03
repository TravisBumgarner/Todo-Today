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
      projects: '[id], title, startDate, endDate, status',
      tasks: '[id], projectId, title, status',
      todoListItems: '[id], duration, projectId, taskId, date'
    });
  }
}

const db = new MySubClassedDexie();

export default db