import { useQuery } from '@tanstack/react-query';
import { chatRepository } from '@/repositories/chatRepository';

export function useMessageSearch(chatId: string | undefined, query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: ['messageSearch', chatId, q],
    enabled: !!chatId && q.length > 0,
    queryFn: () => chatRepository.searchMessages({ chatId: chatId as string, query: q, limit: 50 }),
  });
}


