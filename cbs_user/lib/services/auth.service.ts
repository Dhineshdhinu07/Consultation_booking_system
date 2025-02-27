'use client';

import { User, AuthResponse, RegisterData, UpdateProfileData, LoginData } from '@/lib/types/auth';
import { api } from '@/lib/utils/api';
import type { ApiError } from '@/lib/utils/api';

class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static USER_KEY = 'user_data';

  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);

      if (!response || !response.token || !response.user) {
        throw new Error('Invalid login response from server');
      }

      // Store user data in memory and sessionStorage for persistence across tabs
      this.setUser(response.user);
      
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  static async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      if (!registerData.name || !registerData.email || !registerData.password) {
        throw new Error('Name, email, and password are required');
      }

      const response = await api.post<AuthResponse>('/auth/register', registerData);
      
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid registration response from server');
      }

      // Store user data in memory and sessionStorage for persistence across tabs
      this.setUser(response.user);
      
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      // First try to get from memory/session
      const cachedUser = this.getUser();
      if (cachedUser) {
        return cachedUser;
      }

      // If no cached user but we have a token, fetch from API
      const data = await api.get<{ success: boolean; user: User }>('/user/profile');
      
      if (data.user) {
        this.setUser(data.user);
        return data.user;
      }
      
      return null;
    } catch (error) {
      if (error instanceof Error && (error as ApiError).status === 401) {
        this.logout();
      }
      return null;
    }
  }

  static async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await api.patch<{ user: User }>('/user/profile', data);
      if (response.user) {
        this.setUser(response.user);
        return response.user;
      }
      throw new Error('Invalid update response from server');
    } catch (error) {
      throw error;
    }
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Token is handled by httpOnly cookies automatically
    return null;
  }

  private static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = sessionStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  private static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    return !!this.getUser();
  }

  static hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  static logout(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(this.USER_KEY);
    // Clear the httpOnly cookie by making a logout request
    api.post('/auth/logout').catch(() => {
      // Ignore errors during logout
    });
  }
}

export default AuthService;