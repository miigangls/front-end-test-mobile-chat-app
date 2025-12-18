import React from 'react';
import { Modal, Pressable, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppColors } from '@/hooks/useAppColors';

export function EditMessageModal({
  visible,
  value,
  onChange,
  onClose,
  onSave,
}: {
  visible: boolean;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const colors = useAppColors();

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <ThemedView style={styles.backdrop}>
        <ThemedView style={styles.sheet}>
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle">Edit message</ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.primary} />
            </Pressable>
          </ThemedView>
          <TextInput
            value={value}
            onChangeText={onChange}
            multiline
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
          />
          <Pressable style={[styles.save, { backgroundColor: colors.primary }]} onPress={onSave}>
            <ThemedText style={styles.saveText}>Save</ThemedText>
          </Pressable>
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
    minHeight: 90,
  },
  save: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


