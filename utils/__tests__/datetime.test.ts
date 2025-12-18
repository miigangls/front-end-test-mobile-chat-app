import { formatRelativeChatTime } from '@/utils/datetime';

describe('utils/datetime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('formatRelativeChatTime returns Yesterday when timestamp is exactly 1 day ago', () => {
    const now = new Date('2025-01-10T12:00:00.000Z').getTime();
    jest.setSystemTime(now);
    const ts = now - 24 * 60 * 60 * 1000;
    expect(formatRelativeChatTime(ts)).toBe('Yesterday');
  });
});


