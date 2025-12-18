import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppColors } from '@/hooks/useAppColors';
import type { User } from '@/types/user';
import { capitalizeFirst } from '@/utils/text';

export function ProfileHeader({ user }: { user: User }) {
  const colors = useAppColors();

  return (
    <ThemedView style={styles.container}>
      <Avatar user={user} size={100} />
      <ThemedView style={styles.info}>
        <ThemedText type="title">{user.name}</ThemedText>
        <ThemedText style={[styles.statusText, { color: colors.mutedText }]}>
          {capitalizeFirst(user.status)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  info: {
    alignItems: 'center',
    marginTop: 16,
  },
  statusText: {
    fontSize: 16,
    marginTop: 4,
  },
});


