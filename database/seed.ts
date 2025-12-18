import { db } from './db';
import { users, chats, chatParticipants, messages } from './schema';

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'online' as const,
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'offline' as const,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'away' as const,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'online' as const,
  },
];

const initialChats = [
  {
    id: 'chat1',
    participants: ['1', '2'],
    messages: [
      {
        id: 'msg1',
        senderId: '2',
        text: 'Hey, how are you?',
        timestamp: Date.now() - 3600000,
      },
      {
        id: 'msg2',
        senderId: '1',
        text: 'I\'m good, thanks for asking!',
        timestamp: Date.now() - 1800000,
      },
    ],
  },
  {
    id: 'chat2',
    participants: ['1', '3'],
    messages: [
      {
        id: 'msg3',
        senderId: '3',
        text: 'Did you check the project?',
        timestamp: Date.now() - 86400000,
      },
    ],
  },
];

async function isDataSeeded() {
  try {
    const result = await db.select().from(users);
    return result.length > 0;
  } catch (error) {
    console.error('Error checking if database is seeded:', error);
    return false;
  }
}

export async function seedDatabase() {
  try {
    const alreadySeeded = await isDataSeeded();
    if (alreadySeeded) {
      console.log('Database already seeded, skipping...');
      return;
    }
    
    console.log('Seeding database...');
    
    console.log('Seeding users...');
    for (const user of mockUsers) {
      await db.insert(users).values(user).onConflictDoNothing();
    }
    
    console.log('Seeding chats...');
    for (const chat of initialChats) {
      await db.insert(chats).values({ id: chat.id }).onConflictDoNothing();
      
      console.log(`Adding participants for chat ${chat.id}...`);
      for (const userId of chat.participants) {
        await db.insert(chatParticipants).values({
          id: `cp-${chat.id}-${userId}`,
          chatId: chat.id,
          userId,
        }).onConflictDoNothing();
      }
      
      console.log(`Adding messages for chat ${chat.id}...`);
      for (const message of chat.messages) {
        await db.insert(messages).values({
          id: message.id,
          chatId: chat.id,
          senderId: message.senderId,
          text: message.text,
          timestamp: message.timestamp,
          type: 'text',
          status: 'sent',
        }).onConflictDoNothing();
      }
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
} 