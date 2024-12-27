type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface HttpClientOptions extends RequestInit {
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number>;
}

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultOptions: HttpClientOptions;

  constructor(baseUrl: string, defaultOptions?: HttpClientOptions) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.defaultOptions = defaultOptions || {};
  }

  #buildQueryParams(params?: Record<string, string | number>): string {
    if (!params) return '';

    const stringParams: Record<string, string> = Object.entries(params).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>,
    );

    return `?${new URLSearchParams(stringParams).toString()}`;
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    options: HttpClientOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${this.#buildQueryParams(
      options.queryParams,
    )}`;
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      ...this.defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error: ${response.status}`, errorData);
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, 'GET', options);
  }

  post<T>(
    endpoint: string,
    body: any,
    options?: HttpClientOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, 'POST', {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: JSON.stringify(body),
    }).catch((err) => {
      throw err;
    });
  }

  put<T>(endpoint: string, body: any, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, 'PUT', {
      ...options,
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', options);
  }
}

const apiClient = new HttpClient(process.env.NEXT_PUBLIC_API_URL || '');

export default apiClient;
