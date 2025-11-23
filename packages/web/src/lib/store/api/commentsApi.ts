import { baseApi } from './baseApi';
import type { Comment, CreateCommentDto, UpdateCommentDto, PaginationDto, PaginatedResponse } from '@/lib/api/types';

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<PaginatedResponse<Comment>, PaginationDto | void>({
      query: (pagination) => {
        const params = new URLSearchParams();
        if (pagination?.page) params.append('page', pagination.page.toString());
        if (pagination?.limit) params.append('limit', pagination.limit.toString());
        return `/comments?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({ type: 'Comment' as const, id })),
            { type: 'Comment', id: 'LIST' },
          ]
          : [{ type: 'Comment', id: 'LIST' }],
    }),
    createComment: builder.mutation<Comment, CreateCommentDto>({
      query: (data) => ({
        url: '/comments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comment', id: 'LIST' },
        { type: 'Post', id: postId },
      ],
    }),
    updateComment: builder.mutation<Comment, { id: number; data: UpdateCommentDto }>({
      query: ({ id, data }) => ({
        url: `/comments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Comment', id: id.toString() }],
    }),
    deleteComment: builder.mutation<Comment, number>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment', id: id.toString() },
        { type: 'Comment', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
