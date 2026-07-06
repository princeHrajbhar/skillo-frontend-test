// src/features/user/api/userApi.ts
import { baseApi } from '../../../services/baseApi';

// ==================== TYPES ====================

export interface IUser {
  _id: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  isVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data: IUser;
}

export interface UsersResponse {
  success: boolean;
  data: IUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LockStatusResponse {
  success: boolean;
  data: {
    email: string;
    isLocked: boolean;
  };
}

// ==================== REQUEST TYPES ====================

export interface CreateUserRequest {
  email: string;
  password: string;
  isVerified?: boolean;
  role?: 'user' | 'admin' | 'superadmin';
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  isVerified?: boolean;
  role?: 'user' | 'admin' | 'superadmin';
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  role?: 'user' | 'admin' | 'superadmin';
  isVerified?: boolean;
  search?: string;
}

// ==================== API SERVICE ====================

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination and filters
    getUsers: builder.query<UsersResponse, GetUsersQuery | void>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'User' as const, id: _id })),
              { type: 'User' as const, id: 'LIST' },
            ]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    // Get user by ID
    getUserById: builder.query<UserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User' as const, id }],
    }),

    // Check lock status by email
    checkLockStatus: builder.query<LockStatusResponse, string>({
      query: (email) => ({
        url: `/users/lock-status/${encodeURIComponent(email)}`,
        method: 'GET',
      }),
    }),

    // Create user
    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User' as const, id: 'LIST' }],
    }),

    // Update user
    updateUser: builder.mutation<UserResponse, { id: string; body: UpdateUserRequest }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User' as const, id },
        { type: 'User' as const, id: 'LIST' },
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<{ success: boolean; message: string; data: { id: string } }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User' as const, id },
        { type: 'User' as const, id: 'LIST' },
      ],
    }),

    // Toggle user verification
    toggleVerification: builder.mutation<UserResponse, string>({
      query: (id) => ({
        url: `/users/${id}/verify`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User' as const, id },
        { type: 'User' as const, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

// ==================== EXPORT HOOKS ====================

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCheckLockStatusQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleVerificationMutation,
} = userApi;