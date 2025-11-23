import { baseApi } from './baseApi';
import type { Post, CreatePostDto, UpdatePostDto, PaginationDto, PaginatedResponse } from '@/lib/api/types';

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PaginatedResponse<Post>, PaginationDto | void>({
      query: (pagination) => {
        const params = new URLSearchParams();
        if (pagination?.page) params.append('page', pagination.page.toString());
        if (pagination?.limit) params.append('limit', pagination.limit.toString());
        return `/posts?${params.toString()}`;
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
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
