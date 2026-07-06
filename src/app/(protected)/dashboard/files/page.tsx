// admin-dashboard/src/app/(pages)/dashboard/files/page.tsx
'use client';

import { useState } from 'react';
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  File,
  Image as ImageIcon,
  Video,
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
  X,
  Copy,
  ExternalLink,
  Grid,
  List,
  Folder,
  HardDrive,
  Clock,
  Hash,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { useFile } from '../../../../features/file/hooks/useFile';

interface FileData {
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

export default function FilesPage() {
  const { files, isLoading, error, uploadProgress, useGetFiles, uploadFile, deleteFile } = useFile();
  const { refetch } = useGetFiles();
  
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle file upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setUploadError(null);
      setSuccess(null);

      await uploadFile(formData);
      setSuccess('File uploaded successfully!');
      refetch();
      
      // Clear file input
      e.target.value = '';
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setUploadError(err.message || 'Failed to upload file');
      setTimeout(() => setUploadError(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setDeleting(true);
      await deleteFile(deleteId);
      setSuccess('File deleted successfully!');
      setShowDeleteModal(false);
      setDeleteId(null);
      refetch();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setUploadError(err.message || 'Failed to delete file');
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (mimeType: string, resourceType: string) => {
    if (resourceType === 'image') return <ImageIcon className="w-6 h-6" />;
    if (resourceType === 'video') return <Video className="w-6 h-6" />;
    if (mimeType?.includes('pdf')) return <FileText className="w-6 h-6" />;
    if (mimeType?.includes('zip') || mimeType?.includes('rar')) return <FileArchive className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const getFileColor = (mimeType: string, resourceType: string) => {
    if (resourceType === 'image') return 'from-purple-100 to-pink-100 text-purple-600';
    if (resourceType === 'video') return 'from-blue-100 to-cyan-100 text-blue-600';
    if (mimeType?.includes('pdf')) return 'from-red-100 to-rose-100 text-red-600';
    if (mimeType?.includes('zip') || mimeType?.includes('rar')) return 'from-amber-100 to-orange-100 text-amber-600';
    return 'from-gray-100 to-slate-100 text-gray-600';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };

  // Filter files based on search
  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.mimeType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.format?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get file statistics
  const totalFiles = files.length;
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const images = files.filter(f => f.resourceType === 'image').length;
  const videos = files.filter(f => f.resourceType === 'video').length;
  const documents = files.filter(f => f.resourceType === 'raw' || f.mimeType?.includes('pdf')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Folder className="w-6 h-6 text-teal-600" />
            File Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLoading ? 'Loading...' : `${totalFiles} files found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25 cursor-pointer">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload'}
            <input
              type="file"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Uploading...</span>
                <span className="text-gray-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Folder className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Files</p>
              <p className="text-xl font-bold text-gray-900">{totalFiles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Size</p>
              <p className="text-xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Images</p>
              <p className="text-xl font-bold text-gray-900">{images}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Video className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Videos</p>
              <p className="text-xl font-bold text-gray-900">{videos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {(error || uploadError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error || uploadError}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files by name, type, or format..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={() => refetch()}
            className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-500"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Files Grid/List */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {isLoading && files.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <Folder className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No files found</h3>
            <p className="text-gray-500 mt-1">
              {searchQuery ? 'Try adjusting your search' : 'Upload your first file to get started'}
            </p>
            {!searchQuery && (
              <label className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer">
                Upload File
                <input
                  type="file"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                className="group bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Preview */}
                <div className="relative aspect-square bg-white">
                  {file.resourceType === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  ) : file.resourceType === 'video' ? (
                    <video className="w-full h-full object-cover" src={file.url} />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getFileColor(file.mimeType, file.resourceType)}`}>
                      {getFileIcon(file.mimeType, file.resourceType)}
                    </div>
                  )}
                  
                  {/* File type badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm">
                    {file.format?.toUpperCase() || 'FILE'}
                  </div>
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedFile(file);
                        setShowPreviewModal(true);
                      }}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(file._id)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-900 truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">
                    File
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">
                    Size
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 hidden xl:table-cell">
                    Uploaded
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFiles.map((file) => (
                  <tr key={file._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getFileColor(file.mimeType, file.resourceType)} flex items-center justify-center flex-shrink-0`}>
                          {getFileIcon(file.mimeType, file.resourceType)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                            {file.originalName}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {file.publicId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {file.format?.toUpperCase() || file.mimeType?.split('/')[1] || 'FILE'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(file.uploadedAt || file.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedFile(file);
                            setShowPreviewModal(true);
                          }}
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(file.url)}
                          className="p-1.5 hover:bg-teal-50 rounded-lg transition-colors text-gray-400 hover:text-teal-600"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="p-1.5 hover:bg-cyan-50 rounded-lg transition-colors text-gray-400 hover:text-cyan-600"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(file._id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getFileColor(selectedFile.mimeType, selectedFile.resourceType)}`}>
                  {getFileIcon(selectedFile.mimeType, selectedFile.resourceType)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedFile.originalName}</h3>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)} • {selectedFile.format?.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedFile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-auto bg-gray-50">
              {selectedFile.resourceType === 'image' ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.originalName}
                  className="max-w-full max-h-[60vh] mx-auto object-contain"
                />
              ) : selectedFile.resourceType === 'video' ? (
                <video
                  src={selectedFile.url}
                  controls
                  className="max-w-full max-h-[60vh] mx-auto"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${getFileColor(selectedFile.mimeType, selectedFile.resourceType)}`}>
                    {getFileIcon(selectedFile.mimeType, selectedFile.resourceType)}
                  </div>
                  <p className="mt-4 text-gray-500">Preview not available for this file type</p>
                  <a
                    href={selectedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">File Name</p>
                  <p className="font-medium text-gray-700 truncate">{selectedFile.originalName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Size</p>
                  <p className="font-medium text-gray-700">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-medium text-gray-700">{selectedFile.mimeType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Format</p>
                  <p className="font-medium text-gray-700">{selectedFile.format?.toUpperCase()}</p>
                </div>
                {selectedFile.width && selectedFile.height && (
                  <div>
                    <p className="text-xs text-gray-500">Dimensions</p>
                    <p className="font-medium text-gray-700">{selectedFile.width} × {selectedFile.height}</p>
                  </div>
                )}
                {selectedFile.duration && (
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium text-gray-700">{selectedFile.duration}s</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Uploaded</p>
                  <p className="font-medium text-gray-700">{formatDate(selectedFile.uploadedAt || selectedFile.createdAt)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">URL</p>
                  <button
                    onClick={() => copyToClipboard(selectedFile.url)}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                  >
                    Copy URL
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delete File</h2>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this file? This will permanently remove it from the system and cloud storage.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete File'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}