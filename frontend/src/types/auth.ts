// User type matching backend UserDto
export interface User {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

// Request types (what we send to API)
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Response types (what we get from API)
export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface VerifyResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

// Error response type
export interface ErrorResponse {
  error: string;
  errors?: Record<string, string[]>;
}