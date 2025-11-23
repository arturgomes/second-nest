/**
 * Users Service
 * 
 * Handles all user-related API calls:
 * - List users with pagination
 * - Get single user
 * - Create user (registration)
 * - Update user
 * - Delete user
 */

import { apiClient } from '../client';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginationDto,
  PaginatedResponse
} from '../types';

export const usersService = {
  /**
   * Get all users with pagination
   * 
   * @param pagination - Page and limit parameters
   * @returns Paginated list of users
   */
  async getAll(pagination?: PaginationDto): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    const response = await apiClient.get<PaginatedResponse<User>>(
      `/users?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single user by ID
   * 
   * @param id - User ID
   * @returns User data
   */
  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user (registration)
   * 
   * @param data - User creation data
   * @returns Created user
   */
  async create(data: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  /**
   * Update an existing user
   * 
   * @param id - User ID
   * @param data - User update data
   * @returns Updated user
   */
  async update(id: number, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user
   * 
   * @param id - User ID
   * @returns Deleted user
   */
  async delete(id: number): Promise<User> {
    const response = await apiClient.delete<User>(`/users/${id}`);
    return response.data;
  },
};
