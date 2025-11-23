/**
 * Posts Service
 * 
 * Handles all post-related API calls:
 * - List posts with pagination
 * - Get single post
 * - Create post
 * - Update post
 * - Delete post
 */

import { apiClient } from '../client';
import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  PaginationDto,
  PaginatedResponse
} from '../types';

export const postsService = {
  /**
   * Get all posts with pagination
   * 
   * @param pagination - Page and limit parameters
   * @returns Paginated list of posts
   */
  async getAll(pagination?: PaginationDto): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    const response = await apiClient.get<PaginatedResponse<Post>>(
      `/posts?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single post by ID
   * 
   * @param id - Post ID
   * @returns Post with author, comments, and likes
   */
  async getById(id: string): Promise<Post> {
    const response = await apiClient.get<Post>(`/posts/${id}`);
    return response.data;
  },

  /**
   * Create a new post
   * 
   * @param data - Post creation data
   * @returns Created post
   */
  async create(data: CreatePostDto): Promise<Post> {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
  },

  /**
   * Update an existing post
   * 
   * @param id - Post ID
   * @param data - Post update data
   * @returns Updated post
   */
  async update(id: string, data: UpdatePostDto): Promise<Post> {
    const response = await apiClient.patch<Post>(`/posts/${id}`, data);
    return response.data;
  },

  /**
   * Delete a post
   * 
   * @param id - Post ID
   * @returns Deleted post
   */
  async delete(id: string): Promise<Post> {
    const response = await apiClient.delete<Post>(`/posts/${id}`);
    return response.data;
  },
};
