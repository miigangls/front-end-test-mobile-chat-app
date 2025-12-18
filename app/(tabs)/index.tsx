import React from 'react';
import { FlatList, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@/hooks/auth/AuthContext';
import { useChats } from '@/hooks/useChats';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ChatListItem } from '@/components/ChatListItem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppColors } from '@/hooks/useAppColors';
import { useNewChatModal } from '@/hooks/chat/useNewChatModal';
import { NewChatModal } from '@/components/chat/NewChatModal';

export default function ChatsScreen() {
  const { currentUser, users } = useAuth();
  const { chats, createChat } = useChats(currentUser?.id ?? null);
  const colors = useAppColors();
  const newChat = useNewChatModal({
    currentUserId: currentUser?.id ?? null,
    onCreateChat: createChat,
  });

  const renderEmptyComponent = () => (
    <ThemedView style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>No chats yet</ThemedText>
      <ThemedText>Tap the + button to start a new conversation</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Chats</ThemedText>
        <Pressable
          style={[styles.newChatButton, { backgroundColor: colors.selection }]}
          onPress={newChat.open}
        >
          <IconSymbol name="plus" size={24} color={colors.primary} />
        </Pressable>
      </ThemedView>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            currentUserId={currentUser?.id || ''}
            users={users}
          />
        )}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContainer}
      />
      <NewChatModal
        visible={newChat.visible}
        onClose={newChat.close}
        users={users.filter((u) => u.id !== currentUser?.id)}
        selectedUserIds={newChat.selectedUserIds}
        onToggleUser={newChat.toggleUser}
        onCreate={newChat.create}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
