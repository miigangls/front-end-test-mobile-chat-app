import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatRepository } from '@/repositories/chatRepository';
import { deleteMediaFiles } from '@/services/mediaStorage';

export function useMessageActions(currentUserId: string | null) {
  const qc = useQueryClient();

  const sendImage = useMutation({
    mutationFn: async (params: {
      chatId: string;
      mediaUri: string;
      thumbnailUri: string;
      mimeType: string;
      sizeBytes: number;
      caption?: string;
    }) => {
      if (!currentUserId) throw new Error('Not logged in');
      return await chatRepository.sendImageMessage({ senderId: currentUserId, ...params });
    },
    onSuccess: (_msg, vars) => {
      qc.invalidateQueries({ queryKey: ['chats', currentUserId] });
      qc.invalidateQueries({ queryKey: ['messages', vars.chatId] });
    },
  });

  const edit = useMutation({
    mutationFn: async (params: { chatId: string; messageId: string; newText: string }) => {
      await chatRepository.editMessage({ messageId: params.messageId, newText: params.newText });
      return true;
    },
    onSuccess: (_ok, vars) => {
      qc.invalidateQueries({ queryKey: ['messages', vars.chatId] });
      qc.invalidateQueries({ queryKey: ['chats', currentUserId] });
    },
  });

  const remove = useMutation({
    mutationFn: async (params: { chatId: string; messageId: string }) => {
      const msg = await chatRepository.getMessageById(params.messageId);
      if (msg?.type === 'image') {
        await deleteMediaFiles({ mediaUri: msg.mediaUri, thumbnailUri: msg.thumbnailUri });
      }
      await chatRepository.deleteMessage({ messageId: params.messageId });
      return true;
    },
    onSuccess: (_ok, vars) => {
      qc.invalidateQueries({ queryKey: ['messages', vars.chatId] });
      qc.invalidateQueries({ queryKey: ['chats', currentUserId] });
    },
  });

  const markRead = useMutation({
    mutationFn: async (params: { chatId: string }) => {
      if (!currentUserId) return;
      await chatRepository.markChatRead({ chatId: params.chatId, readerId: currentUserId });
    },
    onSuccess: (_ok, vars) => {
      qc.invalidateQueries({ queryKey: ['messages', vars.chatId] });
      qc.invalidateQueries({ queryKey: ['chats', currentUserId] });
    },
  });

  return {
    sendImageMessage: async (params: {
      chatId: string;
      mediaUri: string;
      thumbnailUri: string;
      mimeType: string;
      sizeBytes: number;
      caption?: string;
    }) => {
      return await sendImage.mutateAsync(params);
    },
    editMessage: async (params: { chatId: string; messageId: string; newText: string }) => {
      return await edit.mutateAsync(params);
    },
    deleteMessage: async (params: { chatId: string; messageId: string }) => {
      return await remove.mutateAsync(params);
    },
    markChatRead: async (chatId: string) => {
      return await markRead.mutateAsync({ chatId });
    },
    loading:
      sendImage.isPending || edit.isPending || remove.isPending || markRead.isPending,
  };
}


