// src/features/file/slices/fileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFile } from '../api/fileApi';
import { fileApi } from '../api/fileApi';

interface FileState {
  files: IFile[];
  currentFile: IFile | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: FileState = {
  files: [],
  currentFile: null,
  isLoading: false,
  error: null,
  uploadProgress: 0,
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<IFile[]>) => {
      state.files = action.payload;
    },
    setCurrentFile: (state, action: PayloadAction<IFile | null>) => {
      state.currentFile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearFiles: (state) => {
      state.files = [];
      state.currentFile = null;
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    // Handle getFiles
    builder
      .addMatcher(
        fileApi.endpoints.getFiles.matchFulfilled,
        (state, action: PayloadAction<{ data: IFile[] }>) => {
          state.files = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        fileApi.endpoints.getFiles.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        fileApi.endpoints.getFiles.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch files';
        }
      )
      // Handle getFileById
      .addMatcher(
        fileApi.endpoints.getFileById.matchFulfilled,
        (state, action: PayloadAction<{ data: IFile }>) => {
          state.currentFile = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        fileApi.endpoints.getFileById.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        fileApi.endpoints.getFileById.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch file';
        }
      )
      // Handle uploadFile
      .addMatcher(
        fileApi.endpoints.uploadFile.matchFulfilled,
        (state) => {
          state.isLoading = false;
          state.error = null;
          state.uploadProgress = 100;
        }
      )
      .addMatcher(
        fileApi.endpoints.uploadFile.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
          state.uploadProgress = 0;
        }
      )
      .addMatcher(
        fileApi.endpoints.uploadFile.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to upload file';
          state.uploadProgress = 0;
        }
      );
  },
});

export const {
  setFiles,
  setCurrentFile,
  setLoading,
  setError,
  setUploadProgress,
  clearFiles,
} = fileSlice.actions;

export default fileSlice.reducer;