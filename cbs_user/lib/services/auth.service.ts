'use client';

import { User, AuthResponse, RegisterData, UpdateProfileData } from '@/lib/types/auth';
import { api } from '@/lib/utils/api';
import type { ApiError } from '@/lib/utils/api';

class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static USER_KEY = 'user';

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', { email, password: '[REDACTED]' });
      
      // Make actual API call to login endpoint
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      console.log('Login API response:', response);

      if (!response || !response.token || !response.user) {
        throw new Error('Invalid login response from server');
      }

      // Store authentication data
      this.setToken(response.token);
      this.setUser(response.user);
      document.cookie = `auth_token=${response.token}; path=/; max-age=2592000`;
      
      return response;
    } catch (error) {
      console.error('Login error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      // Clear any partial auth data in case of error
      this.logout();
      throw error;
    }
  }

  static async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      // Validate required fields
      if (!registerData.name || !registerData.email || !registerData.password) {
        throw new Error('Name, email, and password are required');
      }

      console.log('Attempting registration with data:', {
        ...registerData,
        password: '[REDACTED]' // Don't log the actual password
      });

      // Make actual API call to register endpoint
      const response = await api.post<AuthResponse>('/auth/register', registerData);
      console.log('Registration API response:', response);
      
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid registration response from server');
      }

      // Store authentication data
      this.setToken(response.token);
      this.setUser(response.user);
      document.cookie = `auth_token=${response.token}; path=/; max-age=2592000`;
      
      return response;
    } catch (error) {
      console.error('Registration error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      // Clear any partial auth data in case of error
      this.logout();
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const data = await api.get<{ success: boolean; user: User }>('/user/profile');
      console.log('Get current user response:', data);
      
      if (data.user) {
        this.setUser(data.user);
        return data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      // Only logout if it's an auth error (401)
      if (error instanceof Error && (error as ApiError).status === 401) {
        this.logout();
      }
      return null;
    }
  }

  static async updateProfile(updateData: UpdateProfileData): Promise<User> {
    try {
      console.log('Update profile attempt:', updateData);
      const data = await api.patch<{ success: boolean; user: User }>('/user/profile', updateData);
      console.log('Update profile response:', data);
      
      if (data.user) {
        this.setUser(data.user);
        return data.user;
      }
      
      throw new Error('Failed to update profile');
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // Also remove the cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Try to get token from localStorage first
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) return token;

    // If not in localStorage, try to get from cookie
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
    if (authCookie) {
      const token = authCookie.split('=')[1];
      // Sync the token to localStorage
      this.setToken(token);
      return token;
    }

    return null;
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default AuthService;