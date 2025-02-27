'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/lib/services/auth.service';
import { User, RegisterData } from '../lib/types/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status only on client side
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

  return {
    user,
    isAuthenticated,
    login: async (email: string, password: string) => {
      try {
        console.log('Starting login process...');
        const result = await AuthService.login(email, password);
        console.log('Login result:', result);
        
        if (result.user && result.token) {
          setUser(result.user);
          setIsAuthenticated(true);
          router.push('/dashboard');
          return result;
        } else {
          throw new Error('Login failed - invalid response');
        }
      } catch (error) {
        console.error('Login error:', error);
        // Make sure to clear any partial auth state
        AuthService.logout();
        setUser(null);
        setIsAuthenticated(false);
        throw error;
      }
    },
    register: async (data: RegisterData) => {
      try {
        console.log('Starting registration process...');
        const result = await AuthService.register(data);
        console.log('Registration result:', result);
        
        if (result.user && result.token) {
          setUser(result.user);
          setIsAuthenticated(true);
          router.push('/dashboard');
          return result;
        } else {
          throw new Error('Registration failed - invalid response');
        }
      } catch (error) {
        console.error('Registration error:', error);
        // Make sure to clear any partial auth state
        AuthService.logout();
        setUser(null);
        setIsAuthenticated(false);
        throw error;
      }
    },
    logout: () => {
      AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };
}    