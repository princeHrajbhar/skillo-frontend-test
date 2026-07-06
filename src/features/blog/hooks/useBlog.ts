// src/features/blog/hooks/useBlog.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useGetBlogStatsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useDeleteMultipleBlogsMutation,
  useUpdateBlogStatusMutation,
  GetBlogsQuery,
} from '../api/blogApi';
import {
  setBlogs,
  setCurrentBlog,
  setStats,
  setLoading,
  setError,
  setPagination,
  clearBlogs,
} from '../slices/blogSlice';

export const useBlog = () => {
  const dispatch = useAppDispatch();
  const { blogs, currentBlog, stats, isLoading, error, pagination } = useAppSelector(
    (state) => state.blog
  );

  // These are the actual hooks that will be called at the top level of components
  const useGetBlogs = (params?: GetBlogsQuery) => {
    return useGetBlogsQuery(params, {
      refetchOnMountOrArgChange: true,
    });
  };

  const useGetBlogById = (id: string) => {
    return useGetBlogByIdQuery(id, {
      refetchOnMountOrArgChange: true,
    });
  };

  const useGetBlogBySlug = (slug: string) => {
    return useGetBlogBySlugQuery(slug, {
      refetchOnMountOrArgChange: true,
    });
  };

  const useGetBlogStats = () => {
    return useGetBlogStatsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });
  };

  // Mutation hooks
  const [createBlogMutation] = useCreateBlogMutation();
  const [updateBlogMutation] = useUpdateBlogMutation();
  const [deleteBlogMutation] = useDeleteBlogMutation();
  const [deleteMultipleBlogsMutation] = useDeleteMultipleBlogsMutation();
  const [updateBlogStatusMutation] = useUpdateBlogStatusMutation();

  // Wrapper methods for mutations (these are fine because they don't call hooks)
  const createBlog = useCallback(
    async (data: FormData) => {
      try {
        const result = await createBlogMutation(data).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createBlogMutation]
  );

  const updateBlog = useCallback(
    async ({ id, body }: { id: string; body: FormData }) => {
      try {
        const result = await updateBlogMutation({ id, body }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateBlogMutation]
  );

  const deleteBlog = useCallback(
    async (id: string) => {
      try {
        const result = await deleteBlogMutation(id).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [deleteBlogMutation]
  );

  const deleteMultipleBlogs = useCallback(
    async (ids: string[]) => {
      try {
        const result = await deleteMultipleBlogsMutation({ ids }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [deleteMultipleBlogsMutation]
  );

  const updateBlogStatus = useCallback(
    async ({ id, status }: { id: string; status: 'draft' | 'published' }) => {
      try {
        const result = await updateBlogStatusMutation({ id, status }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateBlogStatusMutation]
  );

  const clearBlogData = useCallback(() => {
    dispatch(clearBlogs());
  }, [dispatch]);

  return {
    // State from Redux
    blogs,
    currentBlog,
    stats,
    isLoading,
    error,
    pagination,

    // Query hooks (these must be called at the component level)
    useGetBlogs,
    useGetBlogById,
    useGetBlogBySlug,
    useGetBlogStats,

    // Mutation methods
    createBlog,
    updateBlog,
    deleteBlog,
    deleteMultipleBlogs,
    updateBlogStatus,

    // Utilities
    clearBlogData,
  };
};