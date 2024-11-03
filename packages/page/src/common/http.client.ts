// src/utils/HttpClient.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface HttpClientOptions extends RequestInit {
  headers?: Record<string, string>;
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    options: HttpClientOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error: ${response.status}`, errorData);
      throw new Error(errorData.message || 'API 요청 실패');
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, 'GET', options);
  }

  post<T>(endpoint: string, body: any, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, 'POST', { ...options, body: JSON.stringify(body) });
  }

  put<T>(endpoint: string, body: any, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, 'PUT', { ...options, body: JSON.stringify(body) });
  }

  delete<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', options);
  }
}

const apiClient = new HttpClient('http://localhost:3000/api');

export default apiClient;