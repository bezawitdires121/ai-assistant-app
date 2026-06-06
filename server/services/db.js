import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../db.json');

const adapter = new JSONFile(file);
const defaultData = { users: [], chats: [] };
export const db = new Low(adapter, defaultData);

export const initDb = async () => {
  await db.read();
  db.data ||= defaultData;
  await db.write();
  console.log('[db] Local JSON database ready');
};