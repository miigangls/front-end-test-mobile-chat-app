import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { ThemedText } from '@/components/ThemedText';
import type { User } from '@/types/user';

export function ChatRoomHeaderTitle({
  chatTitle,
  avatarUser,
}: {
  chatTitle: string;
  avatarUser?: User;
}) {
  return (
    <View style={styles.container}>
      <Avatar user={avatarUser} size={32} showStatus={false} />
      <ThemedText type="defaultSemiBold" numberOfLines={1}>
        {chatTitle}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});


