'use client';

import { useState, useEffect } from 'react';
import AuthService from '@/lib/services/auth.service';
import { User } from '../lib/types/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication status only on client side
    setIsAuthenticated(AuthService.isAuthenticated());
  }, []);

  return {
    user,
    isAuthenticated,
    login: async (email: string, password: string) => {
      const result = await AuthService.login(email, password);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    },
    register: async (email: string, password: string, name: string) => {
      const result = await AuthService.register(email, password, name);
      setUser(result.user);
      setIsAuthenticated(true);
      return result;
    },
    logout: () => {
      AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    }
  };
}    