// src/features/course/slices/courseSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICourse } from '../api/courseApi';
import { courseApi } from '../api/courseApi';

interface CourseState {
  courses: ICourse[];
  currentCourse: ICourse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<ICourse[]>) => {
      state.courses = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<ICourse | null>) => {
      state.currentCourse = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCourses: (state) => {
      state.courses = [];
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    // Handle getCourses
    builder
      .addMatcher(
        courseApi.endpoints.getCourses.matchFulfilled,
        (state, action: PayloadAction<{ data: ICourse[] }>) => {
          state.courses = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        courseApi.endpoints.getCourses.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        courseApi.endpoints.getCourses.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch courses';
        }
      )
      // Handle getCourseById
      .addMatcher(
        courseApi.endpoints.getCourseById.matchFulfilled,
        (state, action: PayloadAction<{ data: ICourse }>) => {
          state.currentCourse = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        courseApi.endpoints.getCourseById.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        courseApi.endpoints.getCourseById.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch course';
        }
      );
  },
});

export const {
  setCourses,
  setCurrentCourse,
  setLoading,
  setError,
  clearCourses,
} = courseSlice.actions;

export default courseSlice.reducer;