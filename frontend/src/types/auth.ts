export interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}