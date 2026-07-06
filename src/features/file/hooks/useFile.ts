// src/features/file/hooks/useFile.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  useGetFilesQuery,
  useGetFileByIdQuery,
  useUploadFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
} from '../api/fileApi';
import {
  setFiles,
  setCurrentFile,
  setLoading,
  setError,
  setUploadProgress,
  clearFiles,
} from '../slices/fileSlice';

export const useFile = () => {
  const dispatch = useAppDispatch();
  const { files, currentFile, isLoading, error, uploadProgress } = useAppSelector(
    (state) => state.file
  );

  // Query hooks
  const useGetFiles = useGetFilesQuery;
  const useGetFileById = useGetFileByIdQuery;

  // Mutation hooks
  const [uploadFileMutation] = useUploadFileMutation();
  const [updateFileMutation] = useUpdateFileMutation();
  const [deleteFileMutation] = useDeleteFileMutation();

  // Upload file with progress tracking
  const uploadFile = useCallback(
    async (data: FormData) => {
      try {
        dispatch(setUploadProgress(0));
        const result = await uploadFileMutation(data).unwrap();
        dispatch(setUploadProgress(100));
        return result;
      } catch (error) {
        dispatch(setUploadProgress(0));
        throw error;
      }
    },
    [uploadFileMutation, dispatch]
  );

  const updateFile = useCallback(
    async ({ id, body }: { id: string; body: FormData }) => {
      try {
        const result = await updateFileMutation({ id, body }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateFileMutation]
  );

  const deleteFile = useCallback(
    async (id: string) => {
      try {
        const result = await deleteFileMutation(id).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [deleteFileMutation]
  );

  const clearFileData = useCallback(() => {
    dispatch(clearFiles());
  }, [dispatch]);

  return {
    // State
    files,
    currentFile,
    isLoading,
    error,
    uploadProgress,

    // Query hooks (to be called at component level)
    useGetFiles,
    useGetFileById,

    // Mutation methods
    uploadFile,
    updateFile,
    deleteFile,

    // Utilities
    clearFileData,
  };
};