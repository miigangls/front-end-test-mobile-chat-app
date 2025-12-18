import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

const sqlite = SQLite.openDatabaseSync('chat-app.db');

export const db = drizzle(sqlite, { schema });

export async function initializeDatabase() {
  try {
    console.log('Creating users table...');
    await sqlite.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL,
        status TEXT NOT NULL
      );
    `);
    
    console.log('Creating chats table...');
    await sqlite.execAsync(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY
      );
    `);
    
    console.log('Creating chat_participants table...');
    await sqlite.execAsync(`
      CREATE TABLE IF NOT EXISTS chat_participants (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        FOREIGN KEY (chat_id) REFERENCES chats (id)
      );
    `);
    
    console.log('Creating messages table...');
    await sqlite.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        type TEXT NOT NULL DEFAULT 'text',
        media_uri TEXT,
        thumbnail_uri TEXT,
        mime_type TEXT,
        size_bytes INTEGER,
        status TEXT NOT NULL DEFAULT 'sent',
        edited_at INTEGER,
        deleted_at INTEGER,
        FOREIGN KEY (chat_id) REFERENCES chats (id)
      );
    `);

    const columns = (await sqlite.getAllAsync<{ name: string }>(`PRAGMA table_info(messages);`)).map(
      (c) => c.name
    );
    const has = (name: string) => columns.includes(name);

    const addColumn = async (name: string, ddl: string) => {
      if (has(name)) return;
      await sqlite.execAsync(`ALTER TABLE messages ADD COLUMN ${ddl};`);
    };

    await addColumn('type', `type TEXT NOT NULL DEFAULT 'text'`);
    await addColumn('media_uri', `media_uri TEXT`);
    await addColumn('thumbnail_uri', `thumbnail_uri TEXT`);
    await addColumn('mime_type', `mime_type TEXT`);
    await addColumn('size_bytes', `size_bytes INTEGER`);
    await addColumn('status', `status TEXT NOT NULL DEFAULT 'sent'`);
    await addColumn('edited_at', `edited_at INTEGER`);
    await addColumn('deleted_at', `deleted_at INTEGER`);

    await sqlite.execAsync(`CREATE INDEX IF NOT EXISTS idx_messages_chat_ts ON messages(chat_id, timestamp);`);
    await sqlite.execAsync(`CREATE INDEX IF NOT EXISTS idx_messages_chat_status ON messages(chat_id, status);`);
    
    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
} 