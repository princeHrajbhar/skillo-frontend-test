// src/features/blogCategory/slices/blogCategorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBlogCategory } from '../api/blogCategoryApi';
import { blogCategoryApi } from '../api/blogCategoryApi';

interface BlogCategoryState {
  categories: IBlogCategory[];
  currentCategory: IBlogCategory | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogCategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

const blogCategorySlice = createSlice({
  name: 'blogCategory',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<IBlogCategory[]>) => {
      state.categories = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<IBlogCategory | null>) => {
      state.currentCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Handle getBlogCategories
    builder
      .addMatcher(
        blogCategoryApi.endpoints.getBlogCategories.matchFulfilled,
        (state, action: PayloadAction<{ data: IBlogCategory[] }>) => {
          state.categories = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        blogCategoryApi.endpoints.getBlogCategories.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogCategoryApi.endpoints.getBlogCategories.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch categories';
        }
      )
      // Handle getBlogCategoryById
      .addMatcher(
        blogCategoryApi.endpoints.getBlogCategoryById.matchFulfilled,
        (state, action: PayloadAction<{ data: IBlogCategory }>) => {
          state.currentCategory = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        blogCategoryApi.endpoints.getBlogCategoryById.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogCategoryApi.endpoints.getBlogCategoryById.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch category';
        }
      );
  },
});

export const {
  setCategories,
  setCurrentCategory,
  setLoading,
  setError,
  clearCategories,
} = blogCategorySlice.actions;

export default blogCategorySlice.reducer;