import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatRepository } from '@/repositories/chatRepository';
import type { Chat } from '@/types/chat';

export function useChats(currentUserId: string | null) {
  const queryClient = useQueryClient();

  const chatsQuery = useQuery({
    queryKey: ['chats', currentUserId],
    queryFn: () => chatRepository.getChatListForUser(currentUserId as string),
    enabled: !!currentUserId,
  });

  const createChatMutation = useMutation({
    mutationFn: async (participantIds: string[]) => {
      return await chatRepository.createChat(currentUserId as string, participantIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', currentUserId] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (vars: { chatId: string; text: string; senderId: string }) => {
      return await chatRepository.sendMessage(vars.chatId, vars.text, vars.senderId);
    },
    onSuccess: (_msg, vars) => {
      queryClient.invalidateQueries({ queryKey: ['chats', currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['messages', vars.chatId] });
    },
  });

  return {
    chats: (chatsQuery.data ?? []) as Chat[],
    createChat: createChatMutation.mutateAsync,
    sendMessage: async (chatId: string, text: string, senderId: string) => {
      const msg = await sendMessageMutation.mutateAsync({ chatId, text, senderId });
      return !!msg;
    },
    loading: chatsQuery.isLoading || createChatMutation.isPending || sendMessageMutation.isPending,
  };
}


