import { useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/auth/AuthContext';
import { useChats } from '@/hooks/useChats';
import { buildChatTitle, getOtherParticipants } from '@/utils/chat';

export function useChatRoom(chatId: string | undefined) {
  const { currentUser, users } = useAuth();
  const { chats, sendMessage, loading } = useChats(currentUser?.id ?? null);

  const usersById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const chat = useMemo(() => {
    if (!chatId) return undefined;
    return chats.find((c) => c.id === chatId);
  }, [chats, chatId]);

  const otherParticipants = useMemo(() => {
    if (!chat || !currentUser) return [];
    return getOtherParticipants(chat.participants, currentUser.id, usersById);
  }, [chat, currentUser, usersById]);

  const chatTitle = useMemo(() => buildChatTitle(otherParticipants), [otherParticipants]);

  const onSend = useCallback(
    async (text: string) => {
      if (!currentUser || !chat) return false;
      return await sendMessage(chat.id, text, currentUser.id);
    },
    [chat, currentUser, sendMessage]
  );

  return {
    chat,
    chatTitle,
    otherParticipants,
    currentUser,
    loading,
    onSend,
  };
}


