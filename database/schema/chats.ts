import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const chats = sqliteTable("chats", {
  id: text("id").primaryKey(),
});

export const chatParticipants = sqliteTable("chat_participants", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull().references(() => chats.id),
  userId: text("user_id").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull().references(() => chats.id),
  senderId: text("sender_id").notNull(),
  text: text("text").notNull(),
  timestamp: integer("timestamp").notNull(),
  type: text("type", { enum: ["text", "image"] }).notNull(),
  mediaUri: text("media_uri"),
  thumbnailUri: text("thumbnail_uri"),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes"),
  status: text("status", { enum: ["sent", "read"] }).notNull(),
  editedAt: integer("edited_at"),
  deletedAt: integer("deleted_at"),
}); 