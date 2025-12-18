import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppColors } from '@/hooks/useAppColors';

export function LogoutButton({ onLogout }: { onLogout: () => void }) {
  const colors = useAppColors();

  return (
    <Pressable style={[styles.button, { backgroundColor: colors.danger }]} onPress={onLogout}>
      <IconSymbol name="arrow.right.square" size={20} color="#FFFFFF" />
      <ThemedText style={styles.text}>Log Out</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});


