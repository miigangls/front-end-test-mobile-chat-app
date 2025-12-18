import React from 'react';
import { StyleSheet, TextInput, Pressable, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppColors } from '@/hooks/useAppColors';

export function MessageComposer({
  value,
  onChangeText,
  onSend,
  onPickImage,
  bottomInset = 0,
  style,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onPickImage?: () => void;
  bottomInset?: number;
  style?: ViewStyle;
}) {
  const colors = useAppColors();
  const disabled = !value.trim();

  return (
    <ThemedView
      style={[styles.container, { borderTopColor: colors.border, paddingBottom: bottomInset }, style]}
    >
      <Pressable style={styles.media} onPress={onPickImage} disabled={!onPickImage}>
        <IconSymbol name="photo" size={22} color={colors.primary} />
      </Pressable>
      <TextInput
        style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface }]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        multiline
      />
      <Pressable style={[styles.send, disabled && styles.disabled]} onPress={onSend} disabled={disabled}>
        <IconSymbol name="arrow.up.circle.fill" size={32} color={colors.primary} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-end',
    borderTopWidth: 1,
  },
  media: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    maxHeight: 100,
  },
  send: {
    marginLeft: 10,
    marginBottom: 5,
  },
  disabled: {
    opacity: 0.5,
  },
});


