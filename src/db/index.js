import { openDB } from 'idb';

const DB_NAME = 'SumlyDB';
const DB_VERSION = 1;
const STORE_NAME = 'calculation_lists';

// Initialize Database
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    },
  });
};

export const dbService = {
  // Save or update a calculation list (session)
  async saveList(list) {
    const db = await initDB();
    return db.put(STORE_NAME, {
      ...list,
      updatedAt: Date.now()
    });
  },

  // Get all lists, ordered by newest first
  async getAllLists() {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const index = tx.store.index('createdAt');
    let cursor = await index.openCursor(null, 'prev');
    const lists = [];
    while (cursor) {
      lists.push(cursor.value);
      cursor = await cursor.continue();
    }
    return lists;
  },

  // Get a specific list by ID
  async getListById(id) {
    const db = await initDB();
    return db.get(STORE_NAME, id);
  },

  // Delete a list
  async deleteList(id) {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
  }
};
