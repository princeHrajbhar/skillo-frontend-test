// src/features/blogCategory/hooks/useBlogCategory.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  useGetBlogCategoriesQuery,
  useGetBlogCategoryByIdQuery,
  useGetBlogCategoryBySlugQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  CreateBlogCategoryRequest,
  UpdateBlogCategoryRequest,
} from '../api/blogCategoryApi';
import {
  setCategories,
  setCurrentCategory,
  setLoading,
  setError,
  clearCategories,
} from '../slices/blogCategorySlice';

export const useBlogCategory = () => {
  const dispatch = useAppDispatch();
  const { categories, currentCategory, isLoading, error } = useAppSelector(
    (state) => state.blogCategory
  );

  // Query hooks
  const useGetBlogCategories = useGetBlogCategoriesQuery;
  const useGetBlogCategoryById = useGetBlogCategoryByIdQuery;
  const useGetBlogCategoryBySlug = useGetBlogCategoryBySlugQuery;

  // Mutation hooks
  const [createBlogCategoryMutation] = useCreateBlogCategoryMutation();
  const [updateBlogCategoryMutation] = useUpdateBlogCategoryMutation();
  const [deleteBlogCategoryMutation] = useDeleteBlogCategoryMutation();

  // Mutation methods
  const createBlogCategory = useCallback(
    async (data: CreateBlogCategoryRequest) => {
      try {
        const result = await createBlogCategoryMutation(data).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createBlogCategoryMutation]
  );

  const updateBlogCategory = useCallback(
    async ({ id, body }: { id: string; body: UpdateBlogCategoryRequest }) => {
      try {
        const result = await updateBlogCategoryMutation({ id, body }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateBlogCategoryMutation]
  );

  const deleteBlogCategory = useCallback(
    async (id: string) => {
      try {
        const result = await deleteBlogCategoryMutation(id).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [deleteBlogCategoryMutation]
  );

  const clearBlogCategoryData = useCallback(() => {
    dispatch(clearCategories());
  }, [dispatch]);

  return {
    // State
    categories,
    currentCategory,
    isLoading,
    error,

    // Query hooks (to be called at component level)
    useGetBlogCategories,
    useGetBlogCategoryById,
    useGetBlogCategoryBySlug,

    // Mutation methods
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,

    // Utilities
    clearBlogCategoryData,
  };
};