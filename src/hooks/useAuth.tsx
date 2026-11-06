'use client';

import React, { createContext, useContext, useState } from 'react';
import { User, LoginDto, RegisterDto } from '@/types';
import { CURRENT_DEMO_USER } from '@/data';
import { apiClient } from '@/lib/api/api-client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<boolean>;
  register: (dto: RegisterDto) => Promise<boolean>;
  logout: () => void;
  updateProfile: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('witbase_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          return CURRENT_DEMO_USER;
        }
      }
      return CURRENT_DEMO_USER;
    }
    return CURRENT_DEMO_USER;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (dto: LoginDto): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const loggedUser: User = {
      ...CURRENT_DEMO_USER,
      username: dto.usernameOrEmail.includes('@')
        ? dto.usernameOrEmail.split('@')[0]
        : dto.usernameOrEmail,
      email: dto.usernameOrEmail.includes('@')
        ? dto.usernameOrEmail
        : `${dto.usernameOrEmail}@witbase.edu`
    };
    setUser(loggedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('witbase_user', JSON.stringify(loggedUser));
    }
    apiClient.setTokens('mock_access_jwt', 'mock_refresh_jwt');
    setIsLoading(false);
    return true;
  };

  const register = async (dto: RegisterDto): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: dto.username,
      fullName: dto.fullName,
      email: dto.email,
      role: dto.role || 'STUDENT',
      avatarUrl: null,
      institutionId: 'inst-void',
      institutionName: 'Void Pavilion',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('witbase_user', JSON.stringify(newUser));
    }
    apiClient.setTokens('mock_access_jwt', 'mock_refresh_jwt');
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('witbase_user');
    }
    apiClient.setTokens(null, null);
  };

  const updateProfile = (partial: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...partial };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('witbase_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
