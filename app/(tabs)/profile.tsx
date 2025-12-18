import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/auth/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { AccountInformation } from '@/components/profile/AccountInformation';
import { LogoutButton } from '@/components/profile/LogoutButton';

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!currentUser) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading user profile...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ProfileHeader user={currentUser} />
        <AccountInformation user={currentUser} />
        <ThemedView style={styles.buttonContainer}>
          <LogoutButton onLogout={handleLogout} />
        </ThemedView>
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
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 80,
  },
});
