import { baseApi } from './baseApi';
import type { Like } from '@/lib/api/types';

export const likesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    toggleLike: builder.mutation<Like, { postId: string; userId: string }>({
      query: ({ postId, userId }) => ({
        url: '/likes/toggle',
        method: 'POST',
        body: { postId, userId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Post', id: postId },
        { type: 'Like', id: postId },
      ],
    }),
    checkIfLiked: builder.query<boolean, { postId: string; userId: string }>({
      query: ({ postId, userId }) => ({
        url: '/likes/check',
        params: { postId, userId },
      }),
      providesTags: (result, error, { postId }) => [{ type: 'Like', id: postId }],
    }),
  }),
});

export const {
  useToggleLikeMutation,
  useCheckIfLikedQuery,
} = likesApi;
