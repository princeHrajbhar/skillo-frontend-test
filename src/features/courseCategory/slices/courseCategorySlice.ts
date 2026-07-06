// src/features/courseCategory/slices/courseCategorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICourseCategory } from '../api/courseCategoryApi';
import { courseCategoryApi } from '../api/courseCategoryApi';

interface CourseCategoryState {
  categories: ICourseCategory[];
  currentCategory: ICourseCategory | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CourseCategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

const courseCategorySlice = createSlice({
  name: 'courseCategory',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<ICourseCategory[]>) => {
      state.categories = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<ICourseCategory | null>) => {
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
    // Handle getCourseCategories
    builder
      .addMatcher(
        courseCategoryApi.endpoints.getCourseCategories.matchFulfilled,
        (state, action: PayloadAction<{ data: ICourseCategory[] }>) => {
          state.categories = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        courseCategoryApi.endpoints.getCourseCategories.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        courseCategoryApi.endpoints.getCourseCategories.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch categories';
        }
      )
      // Handle getCourseCategoryById
      .addMatcher(
        courseCategoryApi.endpoints.getCourseCategoryById.matchFulfilled,
        (state, action: PayloadAction<{ data: ICourseCategory }>) => {
          state.currentCategory = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        courseCategoryApi.endpoints.getCourseCategoryById.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        courseCategoryApi.endpoints.getCourseCategoryById.matchRejected,
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
} = courseCategorySlice.actions;

export default courseCategorySlice.reducer;