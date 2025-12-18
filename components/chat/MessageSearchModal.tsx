import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppColors } from '@/hooks/useAppColors';
import { useMessageSearch } from '@/hooks/chats/useMessageSearch';
import type { Message } from '@/types/chat';
import { formatRelativeChatTime } from '@/utils/datetime';

export function MessageSearchModal({
  visible,
  onClose,
  chatId,
  value,
  onChange,
  onSelectMessage,
}: {
  visible: boolean;
  onClose: () => void;
  chatId: string;
  value: string;
  onChange: (v: string) => void;
  onSelectMessage: (m: Message) => void;
}) {
  const colors = useAppColors();
  const search = useMessageSearch(chatId, value);
  const results = search.data ?? [];

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <ThemedView style={styles.backdrop}>
        <ThemedView style={styles.sheet}>
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle">Search</ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.primary} />
            </Pressable>
          </ThemedView>

          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Search messages…"
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
          />

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => onSelectMessage(item)}>
                <ThemedText numberOfLines={1}>{item.text || '(no text)'}</ThemedText>
                <ThemedText style={[styles.meta, { color: colors.mutedText }]}>
                  {formatRelativeChatTime(item.timestamp)}
                </ThemedText>
              </Pressable>
            )}
            ListEmptyComponent={() => (
              <ThemedView style={styles.empty}>
                <ThemedText style={{ color: colors.mutedText }}>
                  {value.trim() ? 'No results' : 'Type to search'}
                </ThemedText>
              </ThemedView>
            )}
            style={styles.list}
          />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderRadius: 12,
    padding: 16,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  list: {
    marginTop: 12,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
  },
  empty: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});


