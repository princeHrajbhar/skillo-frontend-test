// src/features/blog/slices/blogSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBlog, BlogStats, BlogsResponse, BlogResponse, BlogStatsResponse, PaginationMeta } from '../api/blogApi';
import { blogApi } from '../api/blogApi';

interface BlogState {
  blogs: IBlog[];
  currentBlog: IBlog | null;
  stats: BlogStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
}

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  stats: null,
  isLoading: false,
  error: null,
  pagination: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<IBlog[]>) => {
      state.blogs = action.payload;
    },
    setCurrentBlog: (state, action: PayloadAction<IBlog | null>) => {
      state.currentBlog = action.payload;
    },
    setStats: (state, action: PayloadAction<BlogStats>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (state, action: PayloadAction<{
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    } | null>) => {
      state.pagination = action.payload;
    },
    clearBlogs: (state) => {
      state.blogs = [];
      state.currentBlog = null;
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    // Handle the getBlogs query
    builder
      .addMatcher(
        blogApi.endpoints.getBlogs.matchFulfilled,
        (state, action: PayloadAction<BlogsResponse>) => {
          state.blogs = action.payload.data;
          state.pagination = action.payload.pagination;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.getBlogs.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.getBlogs.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch blogs';
        }
      )
      // Handle getBlogById
      .addMatcher(
        blogApi.endpoints.getBlogById.matchFulfilled,
        (state, action: PayloadAction<BlogResponse>) => {
          state.currentBlog = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.getBlogById.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.getBlogById.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch blog';
        }
      )
      // Handle getBlogStats
      .addMatcher(
        blogApi.endpoints.getBlogStats.matchFulfilled,
        (state, action: PayloadAction<BlogStatsResponse>) => {
          state.stats = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.getBlogStats.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.getBlogStats.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch blog stats';
        }
      );
  },
});

export const {
  setBlogs,
  setCurrentBlog,
  setStats,
  setLoading,
  setError,
  setPagination,
  clearBlogs,
} = blogSlice.actions;

export default blogSlice.reducer;