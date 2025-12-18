import { useCallback, useState } from 'react';

export function useNewChatModal({
  currentUserId,
  onCreateChat,
}: {
  currentUserId: string | null;
  onCreateChat: (participantIds: string[]) => Promise<unknown>;
}) {
  const [visible, setVisible] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => {
    setVisible(false);
    setSelectedUserIds([]);
  }, []);

  const toggleUser = useCallback((userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }, []);

  const create = useCallback(async () => {
    if (!currentUserId) return;
    if (selectedUserIds.length === 0) return;
    await onCreateChat([currentUserId, ...selectedUserIds]);
    close();
  }, [close, currentUserId, onCreateChat, selectedUserIds]);

  return { visible, open, close, selectedUserIds, toggleUser, create };
}


