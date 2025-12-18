import React, { useMemo, useRef, useState } from 'react';
import { Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppColors } from '@/hooks/useAppColors';
import { useChatRoom } from '@/hooks/chat/useChatRoom';
import { useAutoScrollToEnd } from '@/hooks/ui/useAutoScrollToEnd';
import type { Message } from '@/types/chat';
import { ChatRoomHeaderTitle } from '@/components/chat/ChatRoomHeaderTitle';
import { MessageList } from '@/components/chat/MessageList';
import { MessageComposer } from '@/components/chat/MessageComposer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useChatMessages } from '@/hooks/chats/useChatMessages';
import { EditMessageModal } from '@/components/chat/EditMessageModal';
import { MessageSearchModal } from '@/components/chat/MessageSearchModal';
import { useMessageEditor } from '@/hooks/chat/useMessageEditor';
import { useImageSender } from '@/hooks/chat/useImageSender';
import { useChatSearchJump } from '@/hooks/chat/useChatSearchJump';

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { chat, currentUser, chatTitle, otherParticipants, onSend } = useChatRoom(chatId);
  const listRef = useRef<FlashList<Message>>(null);
  const router = useRouter();
  const { messages, hasMore, loadOlder, loadingOlder } = useChatMessages(chatId, currentUser?.id ?? null);
  const [messageText, setMessageText] = useState('');
  const lastMessageId = useMemo(() => messages[messages.length - 1]?.id, [messages]);

  const editor = useMessageEditor({ chatId: chatId ?? '', currentUserId: currentUser?.id ?? '' });
  const search = useChatSearchJump({
    messages,
    hasMore,
    loadOlder,
    scrollToIndex: (index) => listRef.current?.scrollToIndex({ index, animated: true }),
  });
  const pickImage = useImageSender({
    chatId: chatId ?? '',
    currentUserId: currentUser?.id ?? '',
    getCaption: () => messageText,
    onSent: () => setMessageText(''),
  });

  useAutoScrollToEnd<Message>(listRef as any, !!lastMessageId, lastMessageId);

  if (!chat || !currentUser) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Chat not found</ThemedText>
      </ThemedView>
    );
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 64 : 0}
    >
      <StatusBar style="auto" />
      <Stack.Screen
        options={{
          headerTitle: () => <ChatRoomHeaderTitle chatTitle={chatTitle} avatarUser={otherParticipants[0]} />,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}><IconSymbol name="chevron.left" size={24} color={colors.primary} /></Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => search.setSearchVisible(true)}><IconSymbol name="magnifyingglass" size={22} color={colors.primary} /></Pressable>
          ),
        }}
      />
      <MessageList listRef={listRef} messages={messages} currentUserId={currentUser.id} hasMore={hasMore} loadingOlder={loadingOlder} onLoadOlder={loadOlder} onLongPressMessage={editor.onLongPressMessage} />
      <MessageComposer
        value={messageText}
        onChangeText={setMessageText}
        onSend={async () => { if (!messageText.trim()) return; const ok = await onSend(messageText); if (ok) setMessageText(''); }}
        onPickImage={pickImage}
        bottomInset={insets.bottom}
      />
      <EditMessageModal visible={editor.editVisible} value={editor.editValue} onChange={editor.setEditValue} onClose={() => editor.setEditVisible(false)} onSave={editor.saveEdit} />
      <MessageSearchModal visible={search.searchVisible} onClose={() => search.setSearchVisible(false)} chatId={chat.id} value={search.searchValue} onChange={search.setSearchValue} onSelectMessage={search.onSelectMessage} />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 