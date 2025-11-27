import { baseApi } from './baseApi';
import type { Post, CreatePostDto, UpdatePostDto, PaginationDto, PaginatedResponse } from '@/lib/api/types';

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PaginatedResponse<Post>, PaginationDto | void>({
      query: (pagination) => {
        const params = new URLSearchParams();
        if (pagination?.page) params.append('page', pagination.page.toString());
        if (pagination?.limit) params.append('limit', pagination.limit.toString());
        if (pagination?.cursor) params.append('cursor', pagination.cursor);
        return `/posts?${params.toString()}`;
      },
      // Merge results for infinite scroll
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        // If cursor is provided, append new items
        if (arg?.cursor) {
          return {
            ...newItems,
            data: [...currentCache.data, ...newItems.data],
          };
        }
        // Otherwise, replace the cache (initial load)
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({ type: 'Post' as const, id })),
            { type: 'Post', id: 'LIST' },
          ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation<Post, CreatePostDto>({
      query: (data) => ({
        url: '/posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation<Post, { id: string; data: UpdatePostDto }>({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),
    deletePost: builder.mutation<Post, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    publishPost: builder.mutation<Post, string>({
      query: (id) => ({
        url: `/posts/${id}/publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  usePublishPostMutation,
} = postsApi;
