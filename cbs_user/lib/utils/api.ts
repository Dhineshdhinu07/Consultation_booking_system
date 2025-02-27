'use client';

import AuthService from '@/lib/services/auth.service';

export interface ApiError extends Error {
  status: number;
  data?: any;
}

const DEFAULT_TIMEOUT = 15000; // 15 seconds

class Api {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  private static async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = AuthService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = new Error(response.statusText) as ApiError;
      error.status = response.status;
      try {
        error.data = await response.json();
      } catch {
        error.data = { message: response.statusText };
      }

      // Handle specific error cases
      switch (response.status) {
        case 401:
          AuthService.logout();
          error.message = 'Your session has expired. Please log in again.';
          break;
        case 403:
          error.message = 'You do not have permission to perform this action';
          break;
        case 404:
          error.message = 'The requested resource was not found';
          break;
        case 422:
          error.message = error.data?.message || 'Validation failed';
          break;
        case 429:
          error.message = 'Too many requests. Please try again later';
          break;
        default:
          error.message = error.data?.message || 'An unexpected error occurred';
      }

      throw error;
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error('Invalid JSON response from server');
    }
  }

  private static async fetchWithTimeout(
    input: RequestInfo,
    init?: RequestInit & { timeout?: number }
  ): Promise<Response> {
    const { timeout = DEFAULT_TIMEOUT, ...options } = init || {};
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(input, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  }

  static async get<T>(endpoint: string, options?: { timeout?: number }): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: await this.getHeaders(),
      credentials: 'include',
      timeout: options?.timeout,
    });
    return this.handleResponse<T>(response);
  }

  static async post<T>(
    endpoint: string,
    data?: any,
    options?: { timeout?: number }
  ): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
      timeout: options?.timeout,
    });
    return this.handleResponse<T>(response);
  }

  static async patch<T>(
    endpoint: string,
    data: any,
    options?: { timeout?: number }
  ): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
      timeout: options?.timeout,
    });
    return this.handleResponse<T>(response);
  }

  static async delete<T>(endpoint: string, options?: { timeout?: number }): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
      credentials: 'include',
      timeout: options?.timeout,
    });
    return this.handleResponse<T>(response);
  }
}

export const api = Api; 