import { db } from '@/database/db';
import { chats, chatParticipants, messages } from '@/database/schema';
import { and, desc, eq, like, lt, ne, sql } from 'drizzle-orm';
import type { Chat, Message } from '@/types/chat';

export const chatRepository = {
  async getChatListForUser(userId: string): Promise<Chat[]> {
    const userChatIds = db
      .select({ chatId: chatParticipants.chatId })
      .from(chatParticipants)
      .where(eq(chatParticipants.userId, userId))
      .groupBy(chatParticipants.chatId)
      .as('user_chats');

    const latestMessageByChatId = db
      .select({
        chatId: messages.chatId,
        maxTimestamp: sql<number>`max(${messages.timestamp})`.as('maxTimestamp'),
      })
      .from(messages)
      .innerJoin(userChatIds, eq(messages.chatId, userChatIds.chatId))
      .groupBy(messages.chatId)
      .as('latest_message');

    const rows = await db
      .select({
        chatId: userChatIds.chatId,
        participantId: chatParticipants.userId,
        m: messages,
      })
      .from(userChatIds)
      .innerJoin(chatParticipants, eq(chatParticipants.chatId, userChatIds.chatId))
      .leftJoin(latestMessageByChatId, eq(latestMessageByChatId.chatId, userChatIds.chatId))
      .leftJoin(
        messages,
        and(eq(messages.chatId, userChatIds.chatId), eq(messages.timestamp, latestMessageByChatId.maxTimestamp))
      )
      .orderBy(desc(latestMessageByChatId.maxTimestamp));

    if (rows.length === 0) return [];

    const chatMap = new Map<string, { participants: Set<string>; lastMessage?: Message }>();

    for (const row of rows) {
      const existing = chatMap.get(row.chatId) ?? { participants: new Set<string>() };
      existing.participants.add(row.participantId);
      if (!existing.lastMessage && row.m) {
        existing.lastMessage = mapMessageRow(row.m);
      }
      chatMap.set(row.chatId, existing);
    }

    return Array.from(chatMap.entries()).map(([chatId, data]) => ({
      id: chatId,
      participants: Array.from(data.participants),
      lastMessage: data.lastMessage,
    }));
  },

  async createChat(currentUserId: string, participantIds: string[]): Promise<Chat | null> {
    if (!participantIds.includes(currentUserId)) return null;

    const chatId = `chat${Date.now()}`;
    await db.insert(chats).values({ id: chatId });

    for (const userId of participantIds) {
      await db.insert(chatParticipants).values({
        id: `cp-${chatId}-${userId}`,
        chatId,
        userId,
      });
    }

    return { id: chatId, participants: participantIds };
  },

  async sendMessage(chatId: string, text: string, senderId: string): Promise<Message | null> {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const messageId = `msg${Date.now()}`;
    const timestamp = Date.now();

    await db.insert(messages).values({
      id: messageId,
      chatId,
      senderId,
      text: trimmed,
      timestamp,
      type: 'text',
      status: 'sent',
    });

    return {
      id: messageId,
      senderId,
      text: trimmed,
      timestamp,
      type: 'text',
      status: 'sent',
    };
  },

  async sendImageMessage(params: {
    chatId: string;
    senderId: string;
    mediaUri: string;
    thumbnailUri: string;
    mimeType: string;
    sizeBytes: number;
    caption?: string;
  }): Promise<Message> {
    const messageId = `msg${Date.now()}`;
    const timestamp = Date.now();

    await db.insert(messages).values({
      id: messageId,
      chatId: params.chatId,
      senderId: params.senderId,
      text: params.caption?.trim() ?? '',
      timestamp,
      type: 'image',
      mediaUri: params.mediaUri,
      thumbnailUri: params.thumbnailUri,
      mimeType: params.mimeType,
      sizeBytes: params.sizeBytes,
      status: 'sent',
    });

    return {
      id: messageId,
      senderId: params.senderId,
      text: params.caption?.trim() ?? '',
      timestamp,
      type: 'image',
      mediaUri: params.mediaUri,
      thumbnailUri: params.thumbnailUri,
      mimeType: params.mimeType,
      sizeBytes: params.sizeBytes,
      status: 'sent',
    };
  },

  async editMessage(params: { messageId: string; newText: string }): Promise<boolean> {
    const trimmed = params.newText.trim();
    const editedAt = Date.now();
    const res = await db
      .update(messages)
      .set({ text: trimmed, editedAt })
      .where(eq(messages.id, params.messageId));
    return !!res;
  },

  async deleteMessage(params: { messageId: string }): Promise<boolean> {
    const deletedAt = Date.now();
    const res = await db
      .update(messages)
      .set({
        deletedAt,
        mediaUri: null,
        thumbnailUri: null,
        mimeType: null,
        sizeBytes: null,
      })
      .where(eq(messages.id, params.messageId));
    return !!res;
  },

  async getMessageById(messageId: string) {
    const rows = await db.select().from(messages).where(eq(messages.id, messageId));
    return rows.length ? mapMessageRow(rows[0]) : null;
  },

  async markChatRead(params: { chatId: string; readerId: string }): Promise<void> {
    await db
      .update(messages)
      .set({ status: 'read' })
      .where(and(eq(messages.chatId, params.chatId), ne(messages.senderId, params.readerId), ne(messages.status, 'read')));
  },

  async getMessagesPage(params: {
    chatId: string;
    limit: number;
    beforeTimestamp?: number;
  }): Promise<{ items: Message[]; nextCursor: number | null }> {
    const { chatId, limit, beforeTimestamp } = params;

    const whereClause = beforeTimestamp
      ? and(eq(messages.chatId, chatId), lt(messages.timestamp, beforeTimestamp))
      : eq(messages.chatId, chatId);

    const rows = await db
      .select()
      .from(messages)
      .where(whereClause)
      .orderBy(desc(messages.timestamp))
      .limit(limit);

    const items: Message[] = rows.map(mapMessageRow);

    if (items.length < limit) {
      return { items, nextCursor: null };
    }

    const oldest = items[items.length - 1];
    return { items, nextCursor: oldest.timestamp };
  },

  async searchMessages(params: { chatId: string; query: string; limit: number }) {
    const q = params.query.trim();
    if (!q) return [];
    const rows = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.chatId, params.chatId),
          like(messages.text, `%${q}%`),
          sql`${messages.deletedAt} IS NULL`
        )
      )
      .orderBy(desc(messages.timestamp))
      .limit(params.limit);

    return rows.map(mapMessageRow);
  },
};

function mapMessageRow(m: any): Message {
  return {
    id: m.id,
    senderId: m.senderId,
    text: m.deletedAt ? 'Message deleted' : m.text,
    timestamp: m.timestamp,
    type: m.type ?? 'text',
    mediaUri: m.mediaUri ?? null,
    thumbnailUri: m.thumbnailUri ?? null,
    mimeType: m.mimeType ?? null,
    sizeBytes: m.sizeBytes ?? null,
    status: m.status ?? 'sent',
    editedAt: m.editedAt ?? null,
    deletedAt: m.deletedAt ?? null,
  };
}


