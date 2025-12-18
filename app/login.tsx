import React from 'react';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/auth/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserListItem } from '@/components/UserListItem';
import { useAppColors } from '@/hooks/useAppColors';

export default function LoginScreen() {
  const { users, login } = useAuth();
  const colors = useAppColors();
  const router = useRouter();

  const handleUserSelect = async (userId: string) => {
    const ok = await login(userId);
    if (ok) {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Welcome to Chat App</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.mutedText }]}>
            Select a user to continue
          </ThemedText>
        </ThemedView>
        
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserListItem
              user={item}
              onPress={() => handleUserSelect(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
}); 