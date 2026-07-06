// src/features/blog/api/blogApi.ts
import { baseApi } from '../../../services/baseApi';

// ==================== TYPES ====================

export interface ICloudinaryFile {
  url: string;
  publicId: string;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ISocialMediaLink {
  platform: string;
  url: string;
}

export interface IResourceLink {
  title: string;
  url: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  keyword: string[];
  postingDate: string;
  postedBy: string;
  socialMediaLinks: ISocialMediaLink[];
  resourceLinks: IResourceLink[];
  banner?: ICloudinaryFile;
  files: ICloudinaryFile[];
  faq: IFAQ[];
  seoTitle: string;
  seoDescription: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface BlogStats {
  total: number;
  draft: number;
  published: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogsResponse {
  success: boolean;
  message: string;
  data: IBlog[];
  pagination: PaginationMeta;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data: IBlog;
}

export interface BlogStatsResponse {
  success: boolean;
  message: string;
  data: BlogStats;
}

// ==================== REQUEST TYPES ====================

export interface CreateBlogRequest {
  title: string;
  slug: string;
  description: string;
  category: string;
  keyword?: string[];
  postingDate?: string;
  postedBy: string;
  socialMediaLinks?: ISocialMediaLink[];
  resourceLinks?: IResourceLink[];
  faq?: IFAQ[];
  seoTitle?: string;
  seoDescription?: string;
  content: string;
  status?: 'draft' | 'published';
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  id: string;
}

export interface GetBlogsQuery {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published';
  category?: string;
  search?: string;
  sortBy?: 'createdAt' | 'postingDate' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface BulkDeleteRequest {
  ids: string[];
}

export interface UpdateStatusRequest {
  id: string;
  status: 'draft' | 'published';
}

// ==================== API SERVICE ====================

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all blogs with pagination and filters
    getBlogs: builder.query<BlogsResponse, GetBlogsQuery | void>({
      query: (params) => ({
        url: '/blogs',
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Blog' as const, id: _id })),
              { type: 'Blog' as const, id: 'LIST' },
            ]
          : [{ type: 'Blog' as const, id: 'LIST' }],
    }),

    // Get blog by ID
    getBlogById: builder.query<BlogResponse, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Blog' as const, id }],
    }),

    // Get blog by slug
    getBlogBySlug: builder.query<BlogResponse, string>({
      query: (slug) => ({
        url: `/blogs/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'Blog' as const, id: slug }],
    }),

    // Get blog statistics
    getBlogStats: builder.query<BlogStatsResponse, void>({
      query: () => ({
        url: '/blogs/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'Blog' as const, id: 'STATS' }],
    }),

    // Create blog
    createBlog: builder.mutation<BlogResponse, FormData>({
      query: (body) => ({
        url: '/blogs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Blog' as const, id: 'LIST' }],
    }),

    // Update blog
    updateBlog: builder.mutation<BlogResponse, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog' as const, id },
        { type: 'Blog' as const, id: 'LIST' },
        { type: 'Blog' as const, id: 'STATS' },
      ],
    }),

    // Delete blog
    deleteBlog: builder.mutation<BlogResponse, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog' as const, id },
        { type: 'Blog' as const, id: 'LIST' },
        { type: 'Blog' as const, id: 'STATS' },
      ],
    }),

    // Bulk delete blogs
    deleteMultipleBlogs: builder.mutation<
      { success: boolean; message: string; data: { deletedCount: number; failedIds: string[] } },
      BulkDeleteRequest
    >({
      query: (body) => ({
        url: '/blogs/bulk-delete',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Blog' as const, id: 'LIST' },
        { type: 'Blog' as const, id: 'STATS' },
      ],
    }),

    // Update blog status
    updateBlogStatus: builder.mutation<BlogResponse, UpdateStatusRequest>({
      query: ({ id, status }) => ({
        url: `/blogs/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog' as const, id },
        { type: 'Blog' as const, id: 'LIST' },
        { type: 'Blog' as const, id: 'STATS' },
      ],
    }),
  }),
  overrideExisting: false,
});

// ==================== EXPORT HOOKS ====================

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useGetBlogStatsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useDeleteMultipleBlogsMutation,
  useUpdateBlogStatusMutation,
} = blogApi;