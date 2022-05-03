// db.ts
import Dexie, { Table } from 'dexie';

import { TProject, TTask } from 'sharedTypes';

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>; 
  tasks!: Table<TTask>; 

  constructor() {
    super('todo-today');
    this.version(1).stores({
      projects: '[id], title, startDate, endDate, status',
      tasks: '[id], projectId, title, status'
    });
  }
}

const db = new MySubClassedDexie();

export default db