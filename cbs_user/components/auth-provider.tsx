'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/lib/services/auth.service';
import type { User, RegisterData } from '@/lib/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount and after any auth state changes
    const checkAuth = async () => {
      const isAuthed = AuthService.isAuthenticated();
      setIsAuthenticated(isAuthed);
      if (isAuthed) {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await AuthService.login(email, password);
      if (result.user && result.token) {
        setUser(result.user);
        setIsAuthenticated(true);
        router.push('/dashboard');
        return result;
      }
      throw new Error('Login failed - invalid response');
    } catch (error) {
      AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const result = await AuthService.register(data);
      if (result.user && result.token) {
        setUser(result.user);
        setIsAuthenticated(true);
        router.push('/dashboard');
        return result;
      }
      throw new Error('Registration failed - invalid response');
    } catch (error) {
      AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 