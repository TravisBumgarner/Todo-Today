// db.ts
import Dexie, { Table } from 'dexie';

import { TProject } from 'sharedTypes';

class MySubClassedDexie extends Dexie {
  projects!: Table<TProject>; 

  constructor() {
    super('todo-today');
    this.version(1).stores({
      projects: '[id], title, startDate, endDate, status'
    });
  }
}

const db = new MySubClassedDexie();

export default db