// src/features/file/api/fileApi.ts
import { baseApi } from '../../../services/baseApi';

// ==================== TYPES ====================

export interface IFile {
  _id: string;
  originalName: string;
  url: string;
  publicId: string;
  mimeType: string;
  size: number;
  folder: string;
  resourceType: string;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  pages?: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileResponse {
  success: boolean;
  message?: string;
  data: IFile;
}

export interface FilesResponse {
  success: boolean;
  count: number;
  data: IFile[];
}

// ==================== API SERVICE ====================

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all files
    getFiles: builder.query<FilesResponse, void>({
      query: () => ({
        url: '/files',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'File' as const, id: _id })),
              { type: 'File' as const, id: 'LIST' },
            ]
          : [{ type: 'File' as const, id: 'LIST' }],
    }),

    // Get file by ID
    getFileById: builder.query<FileResponse, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'File' as const, id }],
    }),

    // Upload file
    uploadFile: builder.mutation<FileResponse, FormData>({
      query: (body) => ({
        url: '/files',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'File' as const, id: 'LIST' }],
    }),

    // Update file
    updateFile: builder.mutation<FileResponse, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/files/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'File' as const, id },
        { type: 'File' as const, id: 'LIST' },
      ],
    }),

    // Delete file
    deleteFile: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'File' as const, id },
        { type: 'File' as const, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

// ==================== EXPORT HOOKS ====================

export const {
  useGetFilesQuery,
  useGetFileByIdQuery,
  useUploadFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
} = fileApi;