import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { Message } from '@/hooks/useChats';
import { formatTimeHHMM } from '@/utils/datetime';
import { useAppColors } from '@/hooks/useAppColors';
import { useRouter } from 'expo-router';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onLongPress?: (message: Message) => void;
}

export function MessageBubble({ message, isCurrentUser, onLongPress }: MessageBubbleProps) {
  const colors = useAppColors();
  const router = useRouter();

  const statusText = isCurrentUser ? (message.status === 'read' ? '✓✓' : '✓') : '';

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.selfContainer : styles.otherContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser 
          ? [styles.selfBubble, { backgroundColor: colors.chatBubbleSelf }]
          : [styles.otherBubble, { backgroundColor: colors.chatBubbleOther }]
      ]}>
        {message.type === 'image' && !message.deletedAt && (
          <Pressable
            onPress={() => router.push({ pathname: '/ImageViewer', params: { uri: message.mediaUri ?? '' } })}
            onLongPress={() => onLongPress?.(message)}
          >
            <Image
              source={{ uri: message.thumbnailUri ?? message.mediaUri ?? '' }}
              style={styles.image}
              resizeMode="cover"
            />
          </Pressable>
        )}
        <ThemedText style={[
          styles.messageText,
          isCurrentUser && { color: colors.chatBubbleSelfText },
        ]}>
          {message.text}
        </ThemedText>
        <View style={styles.timeContainer}>
          {isCurrentUser && (message.editedAt && !message.deletedAt) ? (
            <ThemedText style={styles.timeText}>Edited</ThemedText>
          ) : null}
          <ThemedText style={styles.timeText}>{formatTimeHHMM(message.timestamp)}</ThemedText>
          {isCurrentUser ? <ThemedText style={styles.timeText}>{statusText}</ThemedText> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  selfContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selfBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  image: {
    width: 220,
    height: 160,
    borderRadius: 12,
    marginBottom: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    opacity: 0.7,
  },
}); 