import React from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppColors } from '@/hooks/useAppColors';

export default function ImageViewerScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const colors = useAppColors();

  return (
    <ThemedView style={styles.container} darkColor="#000" lightColor="#000">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.back}>
              <IconSymbol name="xmark" size={22} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
  },
  back: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});


