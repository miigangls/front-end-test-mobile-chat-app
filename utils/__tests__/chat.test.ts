import { buildChatTitle, getOtherParticipants } from '@/utils/chat';
import type { User } from '@/types/user';

describe('utils/chat', () => {
  const users: User[] = [
    { id: '1', name: 'John Doe', avatar: 'a', status: 'online' },
    { id: '2', name: 'Jane Smith', avatar: 'b', status: 'offline' },
    { id: '3', name: 'Mike Johnson', avatar: 'c', status: 'away' },
  ];

  test('getOtherParticipants excludes current user and resolves users by id', () => {
    const map = new Map(users.map((u) => [u.id, u]));
    const others = getOtherParticipants(['1', '2', '3'], '1', map);
    expect(others.map((u) => u.id)).toEqual(['2', '3']);
  });

  test('buildChatTitle for 0/1/2+ participants', () => {
    expect(buildChatTitle([])).toBe('No participants');
    expect(buildChatTitle([users[1]])).toBe('Jane Smith');
    expect(buildChatTitle([users[1], users[2]])).toBe('Jane Smith & 1 other');
    expect(buildChatTitle([users[1], users[2], users[0]])).toBe('Jane Smith & 2 others');
  });
});


