// db.ts
import Dexie, { Table } from 'dexie';

import { TSettings } from 'sharedTypes';

class MySubClassedDexie extends Dexie {
  friends!: Table<TSettings>; 

  constructor() {
    super('todo-today');
    this.version(1).stores({
      friends: '++id, name, age' // Primary key and indexed props
    });
  }
}

const db = new MySubClassedDexie();

export default db