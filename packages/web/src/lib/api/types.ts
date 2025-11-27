/**
 * API Type Definitions
 * 
 * These types match the backend API models from the NestJS application.
 * They are used for type-safe API communication between frontend and backend.
 */

// ============================================================================
// Core Models
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}
export type PostType = "POST" | "PHOTO"
export interface Post {
  id: string;
  title: string;
  content: string | null;
  type: PostType;
  published: boolean;
  authorId: string | null;
  author?: User;
  comments?: Comment[];
  likes?: Like[];
  isLiked?: boolean; // Whether the current user has liked this post
  _count?: {
    comments: number;
    likes: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author?: User;
  post?: Post;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  user?: User;
  post?: Post;
  createdAt: string;
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

export interface CreateUserDto {
  email: string;
  password: string;
  avatar?: string;
  name?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
}

export interface CreatePostDto {
  title: string;
  content?: string;
  type?: PostType;
  published?: boolean;
  authorId: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  type?: PostType;
  published?: boolean;
}

export interface CreateCommentDto {
  content: string;
  postId: string;
  authorId: string;
}

export interface UpdateCommentDto {
  content?: string;
}

export interface CreateLikeDto {
  postId: string;
  userId: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

// ============================================================================
// Pagination
// ============================================================================

export interface PaginationDto {
  page?: number;
  limit?: number;
  cursor?: string; // Cursor for cursor-based pagination
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string; // Cursor for the next page
  };
}

// ============================================================================
// Authentication
// ============================================================================

export interface AuthResponse {
  access_token: string;
  user: User;
}

// ============================================================================
// API Error Response
// ============================================================================

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
