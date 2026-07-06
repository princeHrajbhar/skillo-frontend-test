// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../services/baseApi';
import authSlice from '../features/auth/slices/authSlice';
import blogSlice from '../features/blog/slices/blogSlice';
import courseSlice from '../features/course/slices/courseSlice';
import userSlice from '@/features/user/slices/userSlice';
import blogCategorySlice from '@/features/blogCategory/slices/blogCategorySlice';
import fileSlice from '@/features/file/slices/fileSlice';
import courseCategoryReducer from '../features/courseCategory/slices/courseCategorySlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice,
    blog: blogSlice,
    course: courseSlice,
    user: userSlice,
    blogCategory: blogCategorySlice,
    courseCategory: courseCategoryReducer,
    file: fileSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['api'],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for refetch behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;