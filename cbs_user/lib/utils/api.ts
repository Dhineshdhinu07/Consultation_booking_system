'use client';

const DEFAULT_TIMEOUT = 15000; // 15 seconds

export interface ApiError extends Error {
  status: number;
  data?: any;
}

class Api {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';
  private static token: string | null = null;

  static setToken(token: string) {
    if (typeof window !== 'undefined') {
      this.token = token;
    }
  }

  static clearToken() {
    this.token = null;
  }

  private static async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add token to Authorization header if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
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
          this.clearToken(); // Clear token on authentication failure
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
      const data = await response.json();
      // If response includes a new token, update it
      if (data.token) {
        this.setToken(data.token);
      }
      return data;
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
        credentials: 'include', // Always include credentials for cookie support
        mode: 'cors', // Enable CORS
        headers: {
          ...options.headers,
          'Origin': window.location.origin,
        }
      });
      clearTimeout(timeoutId);
      
      // Log response details for debugging
      console.log('API Response:', {
        url: input,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('API Request failed:', {
        url: input,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw new Error('Network request failed. Please check your connection.');
    }
  }

  static async get<T>(endpoint: string, options?: { timeout?: number }): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: await this.getHeaders(),
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
      timeout: options?.timeout,
    });
    return this.handleResponse<T>(response);
  }

  static async delete<T>(endpoint: string, options?: { timeout?: number }): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
      timeout: options?.timeout,
    });
    return this.handleResponse<T>(response);
  }
}

export const api = Api; 