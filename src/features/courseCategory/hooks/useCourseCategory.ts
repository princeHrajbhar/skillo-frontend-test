// src/features/courseCategory/hooks/useCourseCategory.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  useGetCourseCategoriesQuery,
  useGetCourseCategoryByIdQuery,
  useGetCourseCategoryBySlugQuery,
  useCreateCourseCategoryMutation,
  useUpdateCourseCategoryMutation,
  useDeleteCourseCategoryMutation,
  CreateCourseCategoryRequest,
  UpdateCourseCategoryRequest,
} from '../api/courseCategoryApi';
import {
  setCategories,
  setCurrentCategory,
  setLoading,
  setError,
  clearCategories,
} from '../slices/courseCategorySlice';

export const useCourseCategory = () => {
  const dispatch = useAppDispatch();
  const { categories, currentCategory, isLoading, error } = useAppSelector(
    (state) => state.courseCategory
  );

  // Query hooks
  const useGetCourseCategories = useGetCourseCategoriesQuery;
  const useGetCourseCategoryById = useGetCourseCategoryByIdQuery;
  const useGetCourseCategoryBySlug = useGetCourseCategoryBySlugQuery;

  // Mutation hooks
  const [createCourseCategoryMutation] = useCreateCourseCategoryMutation();
  const [updateCourseCategoryMutation] = useUpdateCourseCategoryMutation();
  const [deleteCourseCategoryMutation] = useDeleteCourseCategoryMutation();

  // Mutation methods
  const createCourseCategory = useCallback(
    async (data: CreateCourseCategoryRequest) => {
      try {
        const result = await createCourseCategoryMutation(data).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createCourseCategoryMutation]
  );

  const updateCourseCategory = useCallback(
    async ({ id, body }: { id: string; body: UpdateCourseCategoryRequest }) => {
      try {
        const result = await updateCourseCategoryMutation({ id, body }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateCourseCategoryMutation]
  );

  const deleteCourseCategory = useCallback(
    async (id: string) => {
      try {
        const result = await deleteCourseCategoryMutation(id).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [deleteCourseCategoryMutation]
  );

  const clearCourseCategoryData = useCallback(() => {
    dispatch(clearCategories());
  }, [dispatch]);

  return {
    // State
    categories,
    currentCategory,
    isLoading,
    error,

    // Query hooks (to be called at component level)
    useGetCourseCategories,
    useGetCourseCategoryById,
    useGetCourseCategoryBySlug,

    // Mutation methods
    createCourseCategory,
    updateCourseCategory,
    deleteCourseCategory,

    // Utilities
    clearCourseCategoryData,
  };
};