import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import type { User } from '@/types/user';

export function AccountInformation({ user }: { user: User }) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle">Account Information</ThemedText>

      <ThemedView style={styles.infoRow}>
        <ThemedText style={styles.label}>ID:</ThemedText>
        <ThemedText>{user.id}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoRow}>
        <ThemedText style={styles.label}>Full Name:</ThemedText>
        <ThemedText>{user.name}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    width: 100,
  },
});


