// src/features/blogCategory/api/blogCategoryApi.ts
import { baseApi } from '../../../services/baseApi';

// ==================== TYPES ====================

export interface IBlogCategory {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategoryResponse {
  success: boolean;
  data: IBlogCategory;
  message?: string;
}

export interface BlogCategoriesResponse {
  success: boolean;
  data: IBlogCategory[];
}

// ==================== REQUEST TYPES ====================

export interface CreateBlogCategoryRequest {
  name: string;
  slug: string;
}

export interface UpdateBlogCategoryRequest {
  name?: string;
  slug?: string;
}

// ==================== API SERVICE ====================

export const blogCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getBlogCategories: builder.query<BlogCategoriesResponse, void>({
      query: () => ({
        url: '/blogcategory', // Changed from '/blog-categories' to '/blogcategory'
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'BlogCategory' as const, id: _id })),
              { type: 'BlogCategory' as const, id: 'LIST' },
            ]
          : [{ type: 'BlogCategory' as const, id: 'LIST' }],
    }),

    // Get category by ID
    getBlogCategoryById: builder.query<BlogCategoryResponse, string>({
      query: (id) => ({
        url: `/blogcategory/${id}`, // Changed from '/blog-categories/${id}' to '/blogcategory/${id}'
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'BlogCategory' as const, id }],
    }),

    // Get category by slug
    getBlogCategoryBySlug: builder.query<BlogCategoryResponse, string>({
      query: (slug) => ({
        url: `/blogcategory/slug/${slug}`, // Changed from '/blog-categories/slug/${slug}' to '/blogcategory/slug/${slug}'
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'BlogCategory' as const, id: slug }],
    }),

    // Create category
    createBlogCategory: builder.mutation<BlogCategoryResponse, CreateBlogCategoryRequest>({
      query: (body) => ({
        url: '/blogcategory', // Changed from '/blog-categories' to '/blogcategory'
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'BlogCategory' as const, id: 'LIST' }],
    }),

    // Update category
    updateBlogCategory: builder.mutation<BlogCategoryResponse, { id: string; body: UpdateBlogCategoryRequest }>({
      query: ({ id, body }) => ({
        url: `/blogcategory/${id}`, // Changed from '/blog-categories/${id}' to '/blogcategory/${id}'
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'BlogCategory' as const, id },
        { type: 'BlogCategory' as const, id: 'LIST' },
      ],
    }),

    // Delete category
    deleteBlogCategory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/blogcategory/${id}`, // Changed from '/blog-categories/${id}' to '/blogcategory/${id}'
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'BlogCategory' as const, id },
        { type: 'BlogCategory' as const, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

// ==================== EXPORT HOOKS ====================

export const {
  useGetBlogCategoriesQuery,
  useGetBlogCategoryByIdQuery,
  useGetBlogCategoryBySlugQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogCategoryApi;