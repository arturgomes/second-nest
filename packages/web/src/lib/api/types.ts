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
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number | null;
  author?: User;
  comments?: Comment[];
  likes?: Like[];
  _count?: {
    comments: number;
    likes: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  author?: User;
  post?: Post;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: number;
  postId: number;
  userId: number;
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
  published?: boolean;
  authorId: number;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  published?: boolean;
}

export interface CreateCommentDto {
  content: string;
  postId: number;
  authorId: number;
}

export interface UpdateCommentDto {
  content?: string;
}

export interface CreateLikeDto {
  postId: number;
  userId: number;
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
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
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
