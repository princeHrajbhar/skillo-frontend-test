// admin-dashboard/src/app/(protected)/dashboard/components/course/Form.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Link2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Hash,
  Tag,
  Calendar,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Layers,
  File,
  Video,
  BookOpen
} from 'lucide-react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import ContentPreview from '@/components/editor/ContentPreview';

interface CloudinaryFile {
  url: string;
  publicId: string;
}

interface Resource {
  name: string;
  type: 'pdf' | 'image';
  file: CloudinaryFile;
}

interface FAQ {
  question: string;
  answer: string;
}

interface CourseFormData {
  title: string;
  slug: string;
  category: string;
  subCategory: string;
  shortDescription: string;
  price: number;
  discountedPrice: number;
  currency: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  status: 'upcoming' | 'active' | 'ended';
  urls: string[];
  cms: string;
  bannerImage?: CloudinaryFile;
  resources: Resource[];
  faqs: FAQ[];
}

interface CourseFormProps {
  initialData?: CourseFormData;
  onSubmit: (data: FormData) => void;
  loading: boolean;
  isEdit?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  loading,
  isEdit = false
}) => {
  // Create refs for each section
  const basicRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const seoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    slug: '',
    category: '',
    subCategory: '',
    shortDescription: '',
    price: 0,
    discountedPrice: 0,
    currency: 'INR',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    status: 'upcoming',
    urls: [],
    cms: '',
    resources: [],
    faqs: []
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.bannerImage?.url) {
        setBannerPreview(initialData.bannerImage.url);
      }
    }
  }, [initialData]);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // Map section IDs to refs
    const refMap = {
      basic: basicRef,
      pricing: pricingRef,
      media: mediaRef,
      seo: seoRef,
      content: contentRef,
      resources: resourcesRef,
      faqs: faqsRef,
    };

    const ref = refMap[sectionId as keyof typeof refMap];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
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
    const files = Array.from(e.target.files || []);
    setResourceFiles(prev => [...prev, ...files]);
    
    // Add resource entries
    files.forEach(file => {
      const newResource: Resource = {
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        file: {
          url: '',
          publicId: ''
        }
      };
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource]
      }));
    });
  };

  const removeResourceFile = (index: number) => {
    setResourceFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // FIXED: Update FAQ using immutable pattern
  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    setFormData(prev => {
      const updatedFaqs = prev.faqs.map((faq, i) => {
        if (i === index) {
          // Create a new object for the updated FAQ
          return { ...faq, [field]: value };
        }
        return faq;
      });
      return { ...prev, faqs: updatedFaqs };
    });
  };

  // FIXED: Update Resource using immutable pattern
  const updateResource = (index: number, field: keyof Resource, value: string) => {
    setFormData(prev => {
      const updatedResources = prev.resources.map((resource, i) => {
        if (i === index) {
          // Create a new object for the updated resource
          return { ...resource, [field]: value };
        }
        return resource;
      });
      return { ...prev, resources: updatedResources };
    });
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addUrl = () => {
    if (urlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        urls: [...prev.urls, urlInput.trim()]
      }));
      setUrlInput('');
    }
  };

  const removeUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (key === 'keywords' || key === 'urls' || key === 'resources' || key === 'faqs') return;
      const value = formData[key as keyof CourseFormData];
      if (value !== undefined && value !== null) {
        formDataToSend.append(key, String(value));
      }
    });

    // Append keywords
    formData.keywords.forEach(keyword => {
      formDataToSend.append('keywords[]', keyword);
    });

    // Append URLs
    formData.urls.forEach(url => {
      formDataToSend.append('urls[]', url);
    });

    // Append FAQs
    formData.faqs.forEach((faq, index) => {
      formDataToSend.append(`faqs[${index}][question]`, faq.question);
      formDataToSend.append(`faqs[${index}][answer]`, faq.answer);
    });

    // Append resources metadata
    formData.resources.forEach((resource, index) => {
      formDataToSend.append(`resources[${index}][name]`, resource.name);
      formDataToSend.append(`resources[${index}][type]`, resource.type);
    });

    // Append banner file
    if (bannerFile) {
      formDataToSend.append('bannerImage', bannerFile);
    }

    // Append resource files
    resourceFiles.forEach(file => {
      formDataToSend.append('resources', file);
    });

    onSubmit(formDataToSend);
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'content', label: 'Content', icon: Layers },
    { id: 'resources', label: 'Resources', icon: File },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic Info Section */}
      <div 
        ref={basicRef} 
        id="basic" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => {
                handleInputChange(e);
                if (!formData.slug || formData.slug === generateSlug(formData.title)) {
                  setFormData(prev => ({
                    ...prev,
                    slug: generateSlug(e.target.value)
                  }));
                }
              }}
              placeholder="Enter course title"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
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
              placeholder="course-slug"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
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
              placeholder="e.g., Web Development"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Sub Category
            </label>
            <input
              type="text"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              placeholder="e.g., Frontend"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of the course"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
            >
              <option value="upcoming">📅 Upcoming</option>
              <option value="active">✅ Active</option>
              <option value="ended">❌ Ended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div 
        ref={pricingRef} 
        id="pricing" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleNumberChange}
                placeholder="0"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Discounted Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleNumberChange}
                placeholder="0"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                min="0"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Set to 0 for no discount</p>
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div 
        ref={mediaRef} 
        id="media" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
        
        {/* Banner Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Banner Image <span className="text-red-500">*</span>
          </label>
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
                  <img src={bannerPreview} alt="Banner preview" className="max-h-64 mx-auto rounded-lg" />
                  {isEdit && !bannerFile && initialData?.bannerImage && (
                    <span className="absolute top-2 left-2 text-xs bg-teal-600 text-white px-2 py-1 rounded">
                      Current Banner
                    </span>
                  )}
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
                  <p className="text-sm font-medium text-gray-600">Click to upload banner image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div 
        ref={seoRef} 
        id="seo" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              placeholder="SEO optimized title"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              rows={2}
              placeholder="SEO optimized description"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Keywords</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                placeholder="Add a keyword"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword, index) => (
                <span key={index} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div 
        ref={contentRef} 
        id="content" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Content</h3>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            CMS Content
          </label>
          {showPreview ? (
            <ContentPreview html={formData.cms} className="rounded-xl border border-gray-200 p-5" />
          ) : (
            <RichTextEditor
              value={formData.cms}
              onChange={(html) => setFormData((prev) => ({ ...prev, cms: html }))}
              placeholder="<h2>Welcome to the course</h2><p>Course content goes here...</p>"
            />
          )}
          <p className="text-xs text-gray-400 mt-1.5">Use the visual editor, or switch to Source to paste raw HTML. Insert images via upload or URL.</p>
        </div>

        {/* URLs */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">External URLs</label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addUrl()}
              placeholder="https://example.com"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
            <button
              type="button"
              onClick={addUrl}
              className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.urls.map((url, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-600 truncate flex-1">{url}</span>
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div 
        ref={resourcesRef} 
        id="resources" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Upload Resources
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleResourceFilesChange}
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all">
              <div className="flex flex-col items-center">
                <Upload className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-600">Upload resources</p>
                <p className="text-xs text-gray-400 mt-1">PDF or Image files (max 20 files)</p>
              </div>
            </div>
          </div>

          {/* Resource List - FIXED: Using updateResource */}
          {formData.resources.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                    {resource.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-teal-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-teal-600" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={resource.name}
                    onChange={(e) => updateResource(index, 'name', e.target.value)}
                    placeholder="Resource name"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                  <select
                    value={resource.type}
                    onChange={(e) => updateResource(index, 'type', e.target.value as 'pdf' | 'image')}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                  >
                    <option value="pdf">PDF</option>
                    <option value="image">Image</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeResourceFile(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAQs Section - FIXED: Using updateFaq */}
      <div 
        ref={faqsRef} 
        id="faqs" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>

        <div className="space-y-3">
          {formData.faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div className="flex gap-3">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    placeholder="Question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    rows={2}
                    placeholder="Answer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors h-fit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEdit ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {isEdit ? 'Update Course' : 'Create Course'}
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;