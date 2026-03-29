import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import type { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  VerifyResponse,
  ErrorResponse 
} from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies!
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      
      // Store token in cookie (secure, httpOnly in production)
      Cookies.set('auth_token', response.data.token, {
        expires: 7, // 7 days
        secure: false, // Set to true in production (HTTPS)
        sameSite: 'strict',
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Login existing user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      
      // Store token in cookie
      Cookies.set('auth_token', response.data.token, {
        expires: 7,
        secure: false, // Set to true in production
        sameSite: 'strict',
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove token, even if API call fails
      Cookies.remove('auth_token');
    }
  }

  /**
   * Verify if current token is valid
   */
  async verifyToken(): Promise<VerifyResponse> {
    try {
      const response = await api.get<VerifyResponse>('/auth/verify');
      return response.data;
    } catch (error) {
      return { valid: false, error: 'Invalid token' };
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh');
      
      // Update token in cookie
      Cookies.set('auth_token', response.data.token, {
        expires: 7,
        secure: false,
        sameSite: 'strict',
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current token
   */
  getToken(): string | undefined {
    return Cookies.get('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      
      if (axiosError.response?.data?.error) {
        return new Error(axiosError.response.data.error);
      }
      
      if (axiosError.response?.data?.errors) {
        // Handle validation errors
        const errors = axiosError.response.data.errors;
        const firstError = Object.values(errors)[0];
        return new Error(firstError[0]);
      }
      
      return new Error(axiosError.message);
    }
    
    return new Error('An unexpected error occurred');
  }
}

export const authService = new AuthService();