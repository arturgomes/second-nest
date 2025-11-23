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
  Like,
} from '../types';

export const likesService = {
  /**
   * Like/unlike a post
   * 
   * @param id - Post ID
   * @returns Like/unlike response
   */
  async toggle(id: number, userId: number): Promise<Like> {
    const response = await apiClient.post<Like>(`/likes/toggle`, { postId: id, userId: userId });
    return response.data;
  },

};
