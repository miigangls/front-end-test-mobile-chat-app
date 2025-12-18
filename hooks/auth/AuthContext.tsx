import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userRepository } from '@/repositories/userRepository';
import type { User } from '@/types/user';

type AuthContextValue = {
  users: User[];
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (userId: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userRepository.getAll,
  });

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return users.find((u) => u.id === currentUserId) ?? null;
  }, [currentUserId, users]);

  const value: AuthContextValue = useMemo(
    () => ({
      users,
      currentUser,
      isLoggedIn: !!currentUser,
      loading: usersQuery.isLoading,
      logout: () => setCurrentUserId(null),
      login: async (userId: string) => {
        const user = await userRepository.getById(userId);
        if (!user) return false;
        setCurrentUserId(userId);
        return true;
      },
    }),
    [users, currentUser, usersQuery.isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


