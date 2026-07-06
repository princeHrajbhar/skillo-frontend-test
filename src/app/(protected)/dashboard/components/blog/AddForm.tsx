// src/components/dashboard/blog/AddForm.tsx
'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Upload,
  Image as ImageIcon,
  Link2,
  FileText,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Layers
} from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
}

interface SocialMediaLink {
  platform: string;
  url: string;
}

interface ResourceLink {
  title: string;
  url: string;
}

interface AddFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddForm({ onSuccess, onCancel }: AddFormProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    category: '',
    postedBy: '',
    status: 'draft' as 'draft' | 'published',
    keywords: '',
    content: '',
  });

  const [faqs, setFaqs] = useState<FAQ[]>([
    { question: '', answer: '' }
  ]);

  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([
    { platform: '', url: '' }
  ]);

  const [resourceLinks, setResourceLinks] = useState<ResourceLink[]>([
    { title: '', url: '' }
  ]);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerPreview(null);
    }
  };

  const handleResourceFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setResourceFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeResourceFile = (index: number) => {
    setResourceFiles(resourceFiles.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const addSocialMedia = () => {
    setSocialMediaLinks([...socialMediaLinks, { platform: '', url: '' }]);
  };

  const removeSocialMedia = (index: number) => {
    setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
  };

  const updateSocialMedia = (index: number, field: keyof SocialMediaLink, value: string) => {
    const updated = [...socialMediaLinks];
    updated[index][field] = value;
    setSocialMediaLinks(updated);
  };

  const addResourceLink = () => {
    setResourceLinks([...resourceLinks, { title: '', url: '' }]);
  };

  const removeResourceLink = (index: number) => {
    setResourceLinks(resourceLinks.filter((_, i) => i !== index));
  };

  const updateResourceLink = (index: number, field: keyof ResourceLink, value: string) => {
    const updated = [...resourceLinks];
    updated[index][field] = value;
    setResourceLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('seoTitle', formData.seoTitle);
      formDataToSend.append('seoDescription', formData.seoDescription);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('postedBy', formData.postedBy);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('content', formData.content);

      const keywords = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
      keywords.forEach(keyword => {
        formDataToSend.append('keyword[]', keyword);
      });

      faqs.forEach((faq, index) => {
        formDataToSend.append(`faq[${index}][question]`, faq.question);
        formDataToSend.append(`faq[${index}][answer]`, faq.answer);
      });

      socialMediaLinks.forEach((link, index) => {
        formDataToSend.append(`socialMediaLinks[${index}][platform]`, link.platform);
        formDataToSend.append(`socialMediaLinks[${index}][url]`, link.url);
      });

      resourceLinks.forEach((link, index) => {
        formDataToSend.append(`resourceLinks[${index}][title]`, link.title);
        formDataToSend.append(`resourceLinks[${index}][url]`, link.url);
      });

      if (bannerFile) {
        formDataToSend.append('banner', bannerFile);
      }

      resourceFiles.forEach(file => {
        formDataToSend.append('resources', file);
      });

      const response = await fetch('http://localhost:5000/api/v1/blogs', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      setResponse(data);

      if (!response.ok) {
        setError(data.message || 'Failed to create blog');
      } else {
        // Reset form on success
        setFormData({
          title: '',
          slug: '',
          description: '',
          seoTitle: '',
          seoDescription: '',
          category: '',
          postedBy: '',
          status: 'draft',
          keywords: '',
          content: '',
        });
        setFaqs([{ question: '', answer: '' }]);
        setSocialMediaLinks([{ platform: '', url: '' }]);
        setResourceLinks([{ title: '', url: '' }]);
        setBannerFile(null);
        setBannerPreview(null);
        setResourceFiles([]);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'seo', label: 'SEO Settings', icon: Globe },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'content', label: 'Content', icon: Layers },
    { id: 'links', label: 'Links & Social', icon: Link2 },
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-teal-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-2 rounded-xl">
                  <FileText className="w-6 h-6" />
                </span>
                Create New Blog Post
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Fill in the details to create a new blog post</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
            <button
              type="submit"
              form="blog-form"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Publish Post
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sections</p>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
                      <span>{section.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto text-teal-400" />}
                    </button>
                  );
                })}
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
                  <div className="p-1.5 bg-teal-100 rounded-lg">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-gray-700">Need help?</p>
                    <p className="text-xs text-gray-500">Check documentation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                    <p className="text-sm text-gray-500">Essential details about your blog post</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter blog post title"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="my-blog-post"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">URL-friendly: lowercase, numbers, hyphens only</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Technology, Health"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Posted By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postedBy"
                      value={formData.postedBy}
                      onChange={handleInputChange}
                      placeholder="User ID"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm bg-white"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="published">🚀 Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Keywords
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      placeholder="technology, programming, web"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief description of your blog post"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm resize-none"
                    required
                  />
                </div>
              </div>

              {/* SEO Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl">
                    <Globe className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>
                    <p className="text-sm text-gray-500">Optimize your blog for search engines</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Title</label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      placeholder="SEO optimized title"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Description</label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="SEO optimized description"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl">
                    <ImageIcon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Media</h2>
                    <p className="text-sm text-gray-500">Upload banner and resource files</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Image</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                        bannerPreview ? 'border-teal-300 bg-teal-50/50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50/30'
                      }`}>
                        {bannerPreview ? (
                          <div className="relative">
                            <img src={bannerPreview} alt="Banner preview" className="max-h-48 mx-auto rounded-lg" />
                            <button
                              type="button"
                              onClick={() => {
                                setBannerFile(null);
                                setBannerPreview(null);
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-sm font-medium text-gray-600">Click to upload banner</p>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resource Files */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Resource Files</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                        onChange={handleResourceFilesChange}
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all">
                        <div className="flex flex-col items-center">
                          <Upload className="w-10 h-10 text-gray-300 mb-2" />
                          <p className="text-sm font-medium text-gray-600">Upload resources</p>
                          <p className="text-xs text-gray-400 mt-1">Images, videos, PDFs, documents (max 10 files)</p>
                        </div>
                      </div>
                    </div>

                    {resourceFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {resourceFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                                <FileText className="w-4 h-4 text-teal-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                              <span className="text-xs text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeResourceFile(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl">
                    <Layers className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Content</h2>
                    <p className="text-sm text-gray-500">Write your blog post content</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Content (HTML) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={10}
                    placeholder="<h2>Section 1</h2><p>Your content here...</p>"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-mono text-sm resize-y"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1.5">HTML content supported. Use proper HTML tags for formatting.</p>
                </div>
              </div>

              {/* Links & Social Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl">
                    <Link2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Links & Social</h2>
                    <p className="text-sm text-gray-500">Add social media and resource links</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Social Media Links */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-gray-700">Social Media Links</label>
                      <button
                        type="button"
                        onClick={addSocialMedia}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all text-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                    {socialMediaLinks.map((link, index) => (
                      <div key={index} className="flex gap-3 mb-3 items-start">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={link.platform}
                            onChange={(e) => updateSocialMedia(index, 'platform', e.target.value)}
                            placeholder="Platform (e.g., Twitter)"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateSocialMedia(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                          />
                        </div>
                        {socialMediaLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSocialMedia(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Resource Links */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-gray-700">Resource Links</label>
                      <button
                        type="button"
                        onClick={addResourceLink}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all text-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                    {resourceLinks.map((link, index) => (
                      <div key={index} className="flex gap-3 mb-3 items-start">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => updateResourceLink(index, 'title', e.target.value)}
                            placeholder="Resource Title"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateResourceLink(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                          />
                        </div>
                        {resourceLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeResourceLink(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl">
                    <HelpCircle className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
                    <p className="text-sm text-gray-500">Frequently asked questions about this blog</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFaq(index, 'question', e.target.value)}
                            placeholder="Question"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                          />
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                            rows={2}
                            placeholder="Answer"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm resize-none"
                          />
                        </div>
                        {faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFaq(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 h-fit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFaq}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-400 hover:bg-teal-50/30 transition-all text-sm font-medium text-gray-600 hover:text-teal-600"
                  >
                    + Add FAQ
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-center hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Publishing...
                    </span>
                  ) : (
                    'Publish Blog Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Response Modal */}
        {(response || error) && (
          <div className="fixed bottom-6 right-6 max-w-md w-full">
            <div className={`p-4 rounded-2xl shadow-xl border ${
              error ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${
                  error ? 'bg-red-100' : 'bg-emerald-100'
                }`}>
                  {error ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold ${
                    error ? 'text-red-700' : 'text-emerald-700'
                  }`}>
                    {error ? 'Error' : 'Success'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5 break-words">
                    {error || 'Blog post created successfully!'}
                  </p>
                  {response && (
                    <pre className="text-xs bg-white/50 p-2 rounded-lg mt-2 overflow-auto max-h-40">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  )}
                </div>
                <button
                  onClick={() => {
                    setResponse(null);
                    setError(null);
                  }}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}