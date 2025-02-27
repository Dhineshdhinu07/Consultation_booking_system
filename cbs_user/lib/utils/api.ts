const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';

export interface ApiError extends Error {
  isValidationError?: boolean;
  errors?: { message: string }[];
  status?: number;
}

class Api {
  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    try {
      let data;
      if (isJson) {
        data = await response.json();
      } else {
        const textData = await response.text();
        try {
          // Try to parse as JSON even if content-type is not set correctly
          data = JSON.parse(textData);
        } catch {
          data = textData;
        }
      }

      console.log('API Response:', {
        url: response.url,
        status: response.status,
        contentType,
        data: typeof data === 'object' ? data : { message: data }
      });

      if (!response.ok) {
        const error = new Error(
          typeof data === 'object' && data.message 
            ? data.message 
            : typeof data === 'string' 
              ? data 
              : `API request failed with status ${response.status}`
        ) as ApiError;
        
        error.status = response.status;
        if (response.status === 422) {
          error.isValidationError = true;
          error.errors = data.errors;
        }

        throw error;
      }

      return data;
    } catch (error) {
      console.error('API Response handling error:', {
        url: response.url,
        status: response.status,
        contentType,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error
      });
      throw error;
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    console.log('Making API POST request:', {
      url: `${API_BASE_URL}${endpoint}`,
      data: data ? { ...data, password: data.password ? '[REDACTED]' : undefined } : undefined
    });

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API POST request failed:', {
        url: `${API_BASE_URL}${endpoint}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  static async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

export const api = Api; 