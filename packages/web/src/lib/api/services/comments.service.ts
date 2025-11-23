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
  Comment,
  CreateCommentDto,
  PaginationDto,
  PaginatedResponse,
  UpdateCommentDto
} from '../types';

export const commentsService = {
  /**
   * Get all comments with pagination
   * 
   * @param pagination - Page and limit parameters
   * @returns Paginated list of comments
   */
  async getAll(pagination?: PaginationDto): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    const response = await apiClient.get<PaginatedResponse<Comment>>(
      `/comments?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single comment by ID
   * 
   * @param id - Comment ID
   * @returns Comment with author, post, and likes
   */
  async getById(id: number): Promise<Comment> {
    const response = await apiClient.get<Comment>(`/comments/${id}`);
    return response.data;
  },

  /**
   * Create a new comment
   * 
   * @param data - Comment creation data
   * @returns Created comment
   */
  async create(data: CreateCommentDto): Promise<Comment> {
    const response = await apiClient.post<Comment>('/comments', data);
    return response.data;
  },

  /**
   * Update an existing comment
   * 
   * @param id - comment ID
   * @param data - comment update data
   * @returns Updated comment
   */
  async update(id: number, data: UpdateCommentDto): Promise<Comment> {
    const response = await apiClient.patch<Comment>(`/comments/${id}`, data);
    return response.data;
  },

  /**
   * Delete a comment
   * 
   * @param id - comment ID
   * @returns Deleted comment
   */
  async delete(id: number): Promise<Comment> {
    const response = await apiClient.delete<Comment>(`/comments/${id}`);
    return response.data;
  },
};
