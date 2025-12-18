import { useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { chatRepository } from '@/repositories/chatRepository';
import type { Message } from '@/types/chat';

const PAGE_SIZE = 30;

export function useChatMessages(chatId: string | undefined, readerId: string | null) {
  const qc = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: ['messages', chatId],
    enabled: !!chatId,
    initialPageParam: undefined as number | undefined,
    queryFn: async ({ pageParam }) => {
      return await chatRepository.getMessagesPage({
        chatId: chatId as string,
        limit: PAGE_SIZE,
        beforeTimestamp: pageParam,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const allDesc = query.data?.pages.flatMap((p) => p.items) ?? [];
  const messages: Message[] = allDesc.slice().reverse();

  useEffect(() => {
    if (!chatId || !readerId) return;
    if (!messages.length) return;
    const hasUnread = messages.some((m) => m.senderId !== readerId && m.status !== 'read');
    if (!hasUnread) return;
    chatRepository
      .markChatRead({ chatId, readerId })
      .then(() => {
        qc.invalidateQueries({ queryKey: ['messages', chatId] });
        qc.invalidateQueries({ queryKey: ['chats', readerId] });
      })
      .catch(() => undefined);
  }, [chatId, readerId, messages, qc]);

  return {
    messages,
    loading: query.isLoading,
    loadingOlder: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    loadOlder: () => query.fetchNextPage(),
    refetch: () => query.refetch(),
  };
}


