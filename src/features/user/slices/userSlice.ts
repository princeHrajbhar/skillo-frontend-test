// src/features/user/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../api/userApi';
import { userApi } from '../api/userApi';

interface UserState {
  users: IUser[];
  currentUser: IUser | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (state, action: PayloadAction<UserState['pagination']>) => {
      state.pagination = action.payload;
    },
    clearUsers: (state) => {
      state.users = [];
      state.currentUser = null;
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    // Handle getUsers
    builder
      .addMatcher(
        userApi.endpoints.getUsers.matchFulfilled,
        (state, action: PayloadAction<{ data: IUser[]; pagination: UserState['pagination'] }>) => {
          state.users = action.payload.data;
          state.pagination = action.payload.pagination;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        userApi.endpoints.getUsers.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        userApi.endpoints.getUsers.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch users';
        }
      )
      // Handle getUserById
      .addMatcher(
        userApi.endpoints.getUserById.matchFulfilled,
        (state, action: PayloadAction<{ data: IUser }>) => {
          state.currentUser = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        userApi.endpoints.getUserById.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        userApi.endpoints.getUserById.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch user';
        }
      );
  },
});

export const {
  setUsers,
  setCurrentUser,
  setLoading,
  setError,
  setPagination,
  clearUsers,
} = userSlice.actions;

export default userSlice.reducer;