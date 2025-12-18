import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserListItem } from '@/components/UserListItem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import type { User } from '@/types/user';
import { useAppColors } from '@/hooks/useAppColors';

export function NewChatModal({
  visible,
  onClose,
  users,
  selectedUserIds,
  onToggleUser,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  users: User[];
  selectedUserIds: string[];
  onToggleUser: (userId: string) => void;
  onCreate: () => void;
}) {
  const colors = useAppColors();
  const disabled = selectedUserIds.length === 0;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="subtitle">New Chat</ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.primary} />
            </Pressable>
          </ThemedView>

          <ThemedText style={styles.modalSubtitle}>Select users to chat with</ThemedText>

          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <UserListItem
                user={item}
                onPress={() => onToggleUser(item.id)}
                isSelected={selectedUserIds.includes(item.id)}
              />
            )}
            style={styles.userList}
          />

          <Pressable
            style={[
              styles.createButton,
              { backgroundColor: colors.primary },
              disabled && { backgroundColor: colors.disabled },
            ]}
            onPress={onCreate}
            disabled={disabled}
          >
            <ThemedText style={styles.createButtonText}>Create Chat</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    marginBottom: 10,
  },
  userList: {
    maxHeight: 400,
  },
  createButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


