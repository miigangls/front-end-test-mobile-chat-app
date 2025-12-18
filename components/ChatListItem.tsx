import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Chat } from '@/hooks/useChats';
import { Avatar } from './Avatar';
import { ThemedText } from './ThemedText';
import { User } from '@/hooks/useUser';
import { buildChatTitle, getOtherParticipants } from '@/utils/chat';
import { formatRelativeChatTime } from '@/utils/datetime';
import { useAppColors } from '@/hooks/useAppColors';

interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
  users: User[];
}

export function ChatListItem({ chat, currentUserId, users }: ChatListItemProps) {
  const router = useRouter();
  const colors = useAppColors();
  
  const otherParticipants = useMemo(() => {
    const usersById = new Map(users.map((u) => [u.id, u]));
    return getOtherParticipants(chat.participants, currentUserId, usersById);
  }, [chat.participants, currentUserId, users]);

  const chatName = useMemo(() => {
    return buildChatTitle(otherParticipants);
  }, [otherParticipants]);

  const handlePress = () => {
    router.push({ pathname: '/ChatRoom', params: { chatId: chat.id } });
  };

  const timeString = useMemo(() => {
    if (!chat.lastMessage) return '';

    return formatRelativeChatTime(chat.lastMessage.timestamp);
  }, [chat.lastMessage]);

  const isCurrentUserLastSender = chat.lastMessage?.senderId === currentUserId;

  return (
    <Pressable style={[styles.container, { borderBottomColor: colors.border }]} onPress={handlePress}>
      <Avatar 
        user={otherParticipants[0]} 
        size={50}
      />
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.name}>
            {chatName}
          </ThemedText>
          {timeString && (
            <ThemedText style={[styles.time, { color: colors.mutedText }]}>{timeString}</ThemedText>
          )}
        </View>
        <View style={styles.bottomRow}>
          {chat.lastMessage && (
            <ThemedText 
              numberOfLines={1}
              style={[
                styles.lastMessage,
                { color: colors.mutedText },
                isCurrentUserLastSender && styles.currentUserMessage
              ]}
            >
              {isCurrentUserLastSender && 'You: '}{chat.lastMessage.text}
            </ThemedText>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  currentUserMessage: {
    fontStyle: 'italic',
  },
}); 