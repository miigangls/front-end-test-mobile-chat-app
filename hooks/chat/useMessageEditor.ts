import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { Message } from '@/types/chat';
import { useMessageActions } from '@/hooks/chats/useMessageActions';

export function useMessageEditor(params: { chatId: string; currentUserId: string }) {
  const actions = useMessageActions(params.currentUserId);
  const [visible, setVisible] = useState(false);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [value, setValue] = useState('');

  const onLongPress = useCallback(
    (m: Message) => {
      if (m.senderId !== params.currentUserId) return;
      if (m.deletedAt) return;

      const buttons: { text: string; style?: 'cancel' | 'destructive'; onPress?: () => void }[] =
        [];

      if (m.type === 'text') {
        buttons.push({
          text: 'Edit',
          onPress: () => {
            setMessageId(m.id);
            setValue(m.text);
            setVisible(true);
          },
        });
      }

      buttons.push({
        text: 'Delete',
        style: 'destructive',
        onPress: async () => actions.deleteMessage({ chatId: params.chatId, messageId: m.id }),
      });
      buttons.push({ text: 'Cancel', style: 'cancel' });
      Alert.alert('Message', 'Choose an action', buttons);
    },
    [actions, params.chatId, params.currentUserId]
  );

  const save = useCallback(async () => {
    if (!messageId) return;
    await actions.editMessage({ chatId: params.chatId, messageId, newText: value });
    setVisible(false);
    setMessageId(null);
  }, [actions, messageId, params.chatId, value]);

  return {
    editVisible: visible,
    setEditVisible: setVisible,
    editValue: value,
    setEditValue: setValue,
    onLongPressMessage: onLongPress,
    saveEdit: save,
  };
}


