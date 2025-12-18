import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { deleteMediaFiles, persistPickedImage } from '@/services/mediaStorage';
import { useMessageActions } from '@/hooks/chats/useMessageActions';

export function useImageSender(params: {
  chatId: string;
  currentUserId: string;
  getCaption: () => string;
  onSent: () => void;
}) {
  const actions = useMessageActions(params.currentUserId);

  return useCallback(async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (res.canceled) return;

    const asset = res.assets[0];
    const persisted = await persistPickedImage({ uri: asset.uri });

    try {
      await actions.sendImageMessage({
        chatId: params.chatId,
        ...persisted,
        caption: params.getCaption(),
      });
      params.onSent();
    } catch (e) {
      await deleteMediaFiles({ mediaUri: persisted.mediaUri, thumbnailUri: persisted.thumbnailUri });
      throw e;
    }
  }, [actions, params]);
}


