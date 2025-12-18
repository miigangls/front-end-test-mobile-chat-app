import React from 'react';
import { ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MessageBubble } from '@/components/MessageBubble';
import type { Message } from '@/types/chat';
import { useAppColors } from '@/hooks/useAppColors';

export function MessageList({
  listRef,
  messages,
  currentUserId,
  onLoadOlder,
  hasMore,
  loadingOlder,
  onLongPressMessage,
}: {
  listRef: React.RefObject<FlashList<Message>>;
  messages: Message[];
  currentUserId: string;
  onLoadOlder?: () => void;
  hasMore?: boolean;
  loadingOlder?: boolean;
  onLongPressMessage?: (message: Message) => void;
}) {
  const colors = useAppColors();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!onLoadOlder) return;
    if (!hasMore) return;
    if (loadingOlder) return;
    if (e.nativeEvent.contentOffset.y <= 24) {
      onLoadOlder();
    }
  };

  return (
    <FlashList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MessageBubble
          message={item}
          isCurrentUser={item.senderId === currentUserId}
          onLongPress={onLongPressMessage}
        />
      )}
      contentContainerStyle={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      ListEmptyComponent={() => (
        <ThemedView style={styles.empty}>
          <ThemedText>No messages yet. Say hello!</ThemedText>
        </ThemedView>
      )}
      ListHeaderComponent={
        hasMore ? (
          <View style={styles.headerLoader}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      estimatedItemSize={72}
      maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
      keyboardDismissMode="on-drag"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexGrow: 1,
  },
  headerLoader: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});


