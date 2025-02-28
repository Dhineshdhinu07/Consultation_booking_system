'use client';

import { User, AuthResponse, RegisterData, UpdateProfileData, LoginData } from '@/lib/types/auth';
import { api } from '@/lib/utils/api';
import type { ApiError } from '@/lib/utils/api';

class AuthService {
  private static USER_KEY = 'user_data';

  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);

      if (!response || !response.user) {
        throw new Error('Invalid login response from server');
      }

      // Store user data in localStorage for persistence
      this.setUser(response.user);

      // Set token if provided in response
      if (response.token) {
        api.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      if (!registerData.name || !registerData.email || !registerData.password) {
        throw new Error('Name, email, and password are required');
      }

      const response = await api.post<AuthResponse>('/auth/register', registerData);
      
      if (!response || !response.user) {
        throw new Error('Invalid registration response from server');
      }

      // Store user data in localStorage for persistence
      this.setUser(response.user);

      // Set token if provided in response
      if (response.token) {
        api.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      // First try to get from localStorage
      const cachedUser = this.getUser();
      
      // Log authentication state
      console.log('Auth State:', {
        cachedUser: cachedUser ? { ...cachedUser, password: undefined } : null,
      });

      // If no cached user, fetch from API
      if (!cachedUser) {
        console.log('No cached user, fetching from API...');
        const response = await api.get<{ user: User }>('/user/profile');
        
        if (response.user) {
          console.log('User fetched from API:', { ...response.user, password: undefined });
          this.setUser(response.user);
          return response.user;
        }
        return null;
      }

      // Validate cached user with API
      try {
        const response = await api.get<{ user: User }>('/user/profile');
        if (response.user) {
          this.setUser(response.user);
          return response.user;
        }
      } catch (error) {
        console.error('Failed to validate cached user:', error);
        // Clear invalid cached user
        this.clearUser();
        api.clearToken();
        return null;
      }

      return cachedUser;
    } catch (error) {
      console.error('getCurrentUser error:', error);
      if (error instanceof Error && (error as ApiError).status === 401) {
        this.clearUser();
        api.clearToken();
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

  private static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  private static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private static clearUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getUser();
  }

  static hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  static async logout(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      // Clear user data and token first
      this.clearUser();
      api.clearToken();
      
      // Then make the logout request
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
      // Still clear the user data and token even if the request fails
      this.clearUser();
      api.clearToken();
    }
  }
}

export default AuthService;