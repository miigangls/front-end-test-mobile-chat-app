import { capitalizeFirst } from '@/utils/text';

describe('utils/text', () => {
  test('capitalizeFirst capitalizes first character', () => {
    expect(capitalizeFirst('online')).toBe('Online');
  });

  test('capitalizeFirst handles empty string', () => {
    expect(capitalizeFirst('')).toBe('');
  });
});


