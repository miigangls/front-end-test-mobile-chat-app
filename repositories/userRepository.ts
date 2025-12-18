import { db } from '@/database/db';
import { users as usersTable } from '@/database/schema';
import { eq } from 'drizzle-orm';
import type { User } from '@/types/user';

export const userRepository = {
  async getAll(): Promise<User[]> {
    return await db.select().from(usersTable);
  },

  async getById(userId: string): Promise<User | null> {
    const rows = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    return rows.length > 0 ? rows[0] : null;
  },
};


