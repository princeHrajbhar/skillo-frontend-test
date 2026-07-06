// src/features/course/api/courseApi.ts
import { baseApi } from '../../../services/baseApi';

// ==================== TYPES ====================

export interface ICloudinaryFile {
  url: string;
  publicId: string;
}

export interface IResource {
  name: string;
  type: 'pdf' | 'image';
  file: ICloudinaryFile;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export type CourseStatus = 'upcoming' | 'active' | 'ended';

export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  category: string;
  subCategory: string;
  shortDescription: string;
  price: number;
  discountedPrice: number;
  currency: string;
  bannerImage: ICloudinaryFile;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  status: CourseStatus;
  urls: string[];
  resources: IResource[];
  cms: string;
  faqs: IFAQ[];
  whatYouWillLearn?: string[];
  prerequisites?: string[];
  duration?: string;
  curriculum?: {
    title?: string;
    lessons?: { title?: string; duration?: string }[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseResponse {
  success: boolean;
  message?: string;
  data: ICourse;
}

export interface CoursesResponse {
  success: boolean;
  data: ICourse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ==================== QUERY PARAMS ====================

export interface GetCoursesQuery {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  level?: string;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== API SERVICE ====================

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all courses - supports both public and dashboard
    getCourses: builder.query<CoursesResponse, GetCoursesQuery | void>({
      query: (params) => {
        // Build query string if params exist
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              queryParams.append(key, String(value));
            }
          });
        }
        const queryString = queryParams.toString();
        return {
          url: `/courses${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Course' as const, id: _id })),
              { type: 'Course' as const, id: 'LIST' },
            ]
          : [{ type: 'Course' as const, id: 'LIST' }],
      // This ensures dashboard still works with the same data structure
      transformResponse: (response: any) => {
        console.log('📦 Courses API response:', response);
        
        // If response already has pagination
        if (response.pagination) {
          return {
            success: response.success || true,
            data: response.data || [],
            pagination: response.pagination,
          };
        }
        
        // If response has data array
        if (response.data && Array.isArray(response.data)) {
          return {
            success: response.success || true,
            data: response.data,
            pagination: response.pagination || undefined,
          };
        }
        
        // If response is the data array directly
        if (Array.isArray(response)) {
          return {
            success: true,
            data: response,
            pagination: undefined,
          };
        }
        
        // Fallback - return empty array
        return {
          success: true,
          data: [],
          pagination: undefined,
        };
      },
    }),

    // Get course by ID
    getCourseById: builder.query<CourseResponse, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, id) => [{ type: 'Course' as const, id }],
    }),

    // Get course by slug
    getCourseBySlug: builder.query<CourseResponse, string>({
      query: (slug) => ({
        url: `/courses/slug/${slug}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, slug) => [{ type: 'Course' as const, id: slug }],
    }),

    // Create course
    createCourse: builder.mutation<CourseResponse, FormData>({
      query: (body) => ({
        url: '/courses',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: [{ type: 'Course' as const, id: 'LIST' }],
    }),

    // Update course
    updateCourse: builder.mutation<CourseResponse, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/courses/${id}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Course' as const, id },
        { type: 'Course' as const, id: 'LIST' },
      ],
    }),

    // Delete course
    deleteCourse: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Course' as const, id },
        { type: 'Course' as const, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

// ==================== EXPORT HOOKS ====================

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCourseBySlugQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;

export default courseApi;