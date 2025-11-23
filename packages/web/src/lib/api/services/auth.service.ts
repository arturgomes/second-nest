/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls:
 * - Login
 * - Logout
 * - Token management
 */

import { apiClient, tokenManager } from '../client';
import type { LoginDto, AuthResponse, User } from '../types';

export const authService = {
  /**
   * Login user with email and password
   * 
   * @param credentials - User email and password
   * @returns Authentication response with token and user data
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    // Store token and user data
    tokenManager.setToken(response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  },

  /**
   * Logout user
   * Clears token and user data from localStorage
   */
  logout(): void {
    tokenManager.removeToken();
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },
};
