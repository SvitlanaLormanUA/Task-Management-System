import type { AuthContextType } from '../auth/AuthContext';
class ApiClient {
  private baseURL: string;
  private authContext?: AuthContextType;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  setAuthContext(authContext: AuthContextType) {
    this.authContext = authContext;
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const accessToken = this.authContext?.getAccessToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && this.authContext) {
      const refreshSuccess = await this.authContext?.refreshAccessToken?.();
      
      if (refreshSuccess) {
        const newAccessToken = this.authContext.getAccessToken();
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        response = await fetch(`${this.baseURL}${url}`, {
          ...options,
          headers,
        });
      } else {
        this.authContext.logout();
        throw new Error('Authentication failed');
      }
    }

    return response;
  }

  async get(url: string, options: RequestInit = {}) {
    return this.makeRequest(url, { ...options, method: 'GET' });
  }

  async post(url: string, data?: any, options: RequestInit = {}) {
    return this.makeRequest(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(url: string, data?: any, options: RequestInit = {}) {
    return this.makeRequest(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(url: string, options: RequestInit = {}) {
    return this.makeRequest(url, { ...options, method: 'DELETE' });
  }

  async patch(url: string, data?: any, options: RequestInit = {}) {
    return this.makeRequest(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();