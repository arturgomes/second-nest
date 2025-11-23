/**
 * API Client Configuration
 * 
 * This module sets up an axios instance with:
 * - Base URL configuration from environment variables
 * - Request interceptors for authentication
 * - Response interceptors for error handling
 * - Token management
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Create axios instance with base configuration
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

/**
 * Request Interceptor
 * 
 * Automatically adds the JWT token to requests if available.
 * The token is retrieved from localStorage.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      // Add Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Handles common error scenarios:
 * - 401 Unauthorized: Clear token and redirect to login
 * - Other errors: Format error message for display
 */
apiClient.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear the invalid token
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      // Redirect to login page (only on client side)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Format error message
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return Promise.reject({
      status: error.response?.status,
      message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
      originalError: error,
    });
  }
);

/**
 * Token Management Utilities
 */
export const tokenManager = {
  /**
   * Save authentication token to localStorage
   */
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },

  /**
   * Get authentication token from localStorage
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  /**
   * Remove authentication token from localStorage
   */
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  },
};

export default apiClient;
