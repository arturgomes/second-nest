import { baseApi } from './baseApi';
import type { LoginDto, AuthResponse } from '@/lib/api/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (error) {
          // Handle error
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
} = authApi;
