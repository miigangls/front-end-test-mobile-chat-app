import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { Avatar } from './Avatar';
import { User } from '@/hooks/useUser';
import { useAppColors } from '@/hooks/useAppColors';
import { capitalizeFirst } from '@/utils/text';

interface UserListItemProps {
  user: User;
  onPress?: () => void;
  isSelected?: boolean;
}

export function UserListItem({ user, onPress, isSelected }: UserListItemProps) {
  const colors = useAppColors();

  return (
    <Pressable 
      style={[
        styles.container,
        { borderBottomColor: colors.border },
        isSelected && { backgroundColor: colors.selection },
      ]} 
      onPress={onPress}
    >
      <Avatar user={user} size={50} />
      <View style={styles.infoContainer}>
        <ThemedText type="defaultSemiBold">{user.name}</ThemedText>
        <ThemedText style={[styles.statusText, { color: colors.mutedText }]}>
          {capitalizeFirst(user.status)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    marginTop: 4,
  },
}); 