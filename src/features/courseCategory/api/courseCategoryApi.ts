// src/features/courseCategory/api/courseCategoryApi.ts
import { baseApi } from '../../../services/baseApi';

// ==================== TYPES ====================

export interface ICourseCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCategoryResponse {
  success: boolean;
  data: ICourseCategory;
  message?: string;
}

export interface CourseCategoriesResponse {
  success: boolean;
  data: ICourseCategory[];
}

// ==================== REQUEST TYPES ====================

export interface CreateCourseCategoryRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCourseCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
}

// ==================== API SERVICE ====================

export const courseCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getCourseCategories: builder.query<CourseCategoriesResponse, void>({
      query: () => ({
        url: '/coursecategory',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'CourseCategory' as const, id: _id })),
              { type: 'CourseCategory' as const, id: 'LIST' },
            ]
          : [{ type: 'CourseCategory' as const, id: 'LIST' }],
    }),

    // Get category by ID
    getCourseCategoryById: builder.query<CourseCategoryResponse, string>({
      query: (id) => ({
        url: `/coursecategory/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'CourseCategory' as const, id }],
    }),

    // Get category by slug
    getCourseCategoryBySlug: builder.query<CourseCategoryResponse, string>({
      query: (slug) => ({
        url: `/coursecategory/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'CourseCategory' as const, id: slug }],
    }),

    // Create category
    createCourseCategory: builder.mutation<CourseCategoryResponse, CreateCourseCategoryRequest>({
      query: (body) => ({
        url: '/coursecategory',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'CourseCategory' as const, id: 'LIST' }],
    }),

    // Update category
    updateCourseCategory: builder.mutation<CourseCategoryResponse, { id: string; body: UpdateCourseCategoryRequest }>({
      query: ({ id, body }) => ({
        url: `/coursecategory/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'CourseCategory' as const, id },
        { type: 'CourseCategory' as const, id: 'LIST' },
      ],
    }),

    // Delete category
    deleteCourseCategory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/coursecategory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'CourseCategory' as const, id },
        { type: 'CourseCategory' as const, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

// ==================== EXPORT HOOKS ====================

export const {
  useGetCourseCategoriesQuery,
  useGetCourseCategoryByIdQuery,
  useGetCourseCategoryBySlugQuery,
  useCreateCourseCategoryMutation,
  useUpdateCourseCategoryMutation,
  useDeleteCourseCategoryMutation,
} = courseCategoryApi;