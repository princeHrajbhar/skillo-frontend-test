// src/features/course/hooks/useCourse.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCourseBySlugQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../api/courseApi';
import {
  setCourses,
  setCurrentCourse,
  setLoading,
  setError,
  clearCourses,
} from '../slices/courseSlice';

export const useCourse = () => {
  const dispatch = useAppDispatch();
  const { courses, currentCourse, isLoading, error } = useAppSelector(
    (state) => state.course
  );

  // Query hooks
  const useGetCourses = useGetCoursesQuery;
  const useGetCourseById = useGetCourseByIdQuery;
  const useGetCourseBySlug = useGetCourseBySlugQuery;

  // Mutation hooks
  const [createCourseMutation, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourseMutation, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourseMutation, { isLoading: isDeleting }] = useDeleteCourseMutation();

  // Mutation methods
  const createCourse = useCallback(
    async (data: FormData) => {
      try {
        console.log('🔄 Creating course...');
        const result = await createCourseMutation(data).unwrap();
        console.log('✅ Course created:', result);
        return result;
      } catch (error) {
        console.error('❌ Create course error:', error);
        throw error;
      }
    },
    [createCourseMutation]
  );

  const updateCourse = useCallback(
    async ({ id, body }: { id: string; body: FormData }) => {
      try {
        console.log('🔄 Updating course with ID:', id);
        const result = await updateCourseMutation({ id, body }).unwrap();
        console.log('✅ Course updated:', result);
        return result;
      } catch (error) {
        console.error('❌ Update course error:', error);
        throw error;
      }
    },
    [updateCourseMutation]
  );

  const deleteCourse = useCallback(
    async (id: string) => {
      try {
        console.log('🔄 Deleting course:', id);
        const result = await deleteCourseMutation(id).unwrap();
        console.log('✅ Course deleted:', result);
        return result;
      } catch (error) {
        console.error('❌ Delete course error:', error);
        throw error;
      }
    },
    [deleteCourseMutation]
  );

  const clearCourseData = useCallback(() => {
    dispatch(clearCourses());
  }, [dispatch]);

  return {
    // State
    courses,
    currentCourse,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,

    // Query hooks (to be called at component level)
    useGetCourses,
    useGetCourseById,
    useGetCourseBySlug,

    // Mutation methods
    createCourse,
    updateCourse,
    deleteCourse,

    // Utilities
    clearCourseData,
  };
};