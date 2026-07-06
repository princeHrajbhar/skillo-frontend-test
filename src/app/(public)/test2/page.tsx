"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface BlogPost {
  title: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  banner: string | null;
  bannerCaption: string;
  content: string;
  faq: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  slug: string;
  readingTime: number;
  featured: boolean;
  pdfs: { title: string; file: string | null; url: string }[];
  links: { title: string; url: string }[];
}

interface HistoryState {
  content: string;
  timestamp: number;
}

const BlogCreator: React.FC = () => {
  // Blog data state with proper initialization
  const [blogData, setBlogData] = useState<BlogPost>({
    title: "My Awesome Blog Post",
    author: "John Doe",
    publishDate: new Date().toISOString().split("T")[0],
    category: "NCERT Solutions",
    tags: ["education", "learning"],
    banner: null,
    bannerCaption: "",
    content: "<p style='font-size: 16px; line-height: 1.8;'>Welcome to your blog! Start typing or use the toolbar above to format your content.</p>",
    faq: [
      { question: "What is this blog about?", answer: "This blog covers educational content and learning resources." },
      { question: "How can I contribute?", answer: "You can contribute by submitting your articles through the editor." }
    ],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    slug: "",
    readingTime: 0,
    featured: false,
    pdfs: [
      { title: "Introduction to React", file: null, url: "https://example.com/react.pdf" },
      { title: "Advanced JavaScript Concepts", file: null, url: "https://example.com/js.pdf" }
    ],
    links: [
      { title: "React Documentation", url: "https://reactjs.org" },
      { title: "MDN Web Docs", url: "https://developer.mozilla.org" }
    ],
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [tagInput, setTagInput] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewMode, setViewMode] = useState<'design' | 'code'>('design');
  const [codeContent, setCodeContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [findCount, setFindCount] = useState(0);
  const [currentFindIndex, setCurrentFindIndex] = useState(-1);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [replaceTerm, setReplaceTerm] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [fontSize, setFontSize] = useState("16");
  const [fontFamily, setFontFamily] = useState("'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
  const [lineHeight, setLineHeight] = useState("1.8");
  const [selectedColor, setSelectedColor] = useState("#333333");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const [showWordCount, setShowWordCount] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'media' | 'settings'>('editor');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // NEW: Split panel resize state
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const fullScreenRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  // Auto-save content
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (blogData.content) {
        localStorage.setItem('blogContent', blogData.content);
        localStorage.setItem('blogData', JSON.stringify(blogData));
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [blogData]);

  // Load saved content
  useEffect(() => {
    const saved = localStorage.getItem('blogContent');
    if (saved) {
      setBlogData(prev => ({ ...prev, content: saved }));
    }
    const savedData = localStorage.getItem('blogData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setBlogData(prev => ({ 
          ...prev, 
          ...parsed,
          pdfs: parsed.pdfs || [],
          links: parsed.links || [],
          tags: parsed.tags || [],
          faq: parsed.faq || [],
        }));
      } catch (e) {}
    }
  }, []);

  // Update preview and statistics
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = blogData.content;
    }
    updateWordCount();
    updateHistory();
  }, [blogData.content]);

  // Update code content when switching to code view
  useEffect(() => {
    if (viewMode === 'code') {
      setCodeContent(blogData.content);
    }
  }, [viewMode, blogData.content]);

  // Calculate reading time
  useEffect(() => {
    const text = blogData.content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).filter(w => w).length;
    const readingTime = Math.ceil(words / 200);
    setBlogData(prev => ({ ...prev, readingTime }));
  }, [blogData.content]);

  // Update word and character count
  const updateWordCount = () => {
    const text = blogData.content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).filter(w => w);
    setWordCount(words.length);
    setCharCount(text.length);
  };

  // Update history
  const updateHistory = () => {
    if (isTyping) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      content: blogData.content,
      timestamp: Date.now()
    });
    if (newHistory.length > 100) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle content change in design mode with debounce
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setBlogData(prev => ({ ...prev, content }));
      
      if (typingTimer) clearTimeout(typingTimer);
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        updateHistory();
      }, 1000);
      setTypingTimer(timer);
    }
  };

  // Apply formatting
  const execCommand = (command: string, value?: string | undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
    
    switch(command) {
      case 'bold': setIsBold(!isBold); break;
      case 'italic': setIsItalic(!isItalic); break;
      case 'underline': setIsUnderline(!isUnderline); break;
      case 'justifyLeft': setAlignment('left'); break;
      case 'justifyCenter': setAlignment('center'); break;
      case 'justifyRight': setAlignment('right'); break;
      case 'justifyFull': setAlignment('justify'); break;
    }
  };

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBlogData(prev => ({ ...prev, content: history[newIndex].content }));
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex].content;
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBlogData(prev => ({ ...prev, content: history[newIndex].content }));
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex].content;
      }
    }
  };

  // Find and Replace
  const findInText = () => {
    if (!searchTerm || !editorRef.current) return;
    
    const content = editorRef.current.innerHTML;
    const regex = new RegExp(searchTerm, 'gi');
    const matches = content.match(regex);
    setFindCount(matches ? matches.length : 0);
    
    if (matches && matches.length > 0) {
      const highlighted = content.replace(regex, (match) => 
        `<span style="background: #ffff00; padding: 0 2px;">${match}</span>`
      );
      editorRef.current.innerHTML = highlighted;
      setCurrentFindIndex(0);
    }
  };

  const replaceInText = () => {
    if (!searchTerm || !replaceTerm || !editorRef.current) return;
    
    const content = editorRef.current.innerHTML;
    const regex = new RegExp(searchTerm, 'gi');
    const newContent = content.replace(regex, replaceTerm);
    editorRef.current.innerHTML = newContent;
    setBlogData(prev => ({ ...prev, content: newContent }));
    setFindCount(0);
    setCurrentFindIndex(-1);
  };

  const replaceAllInText = () => {
    if (!searchTerm || !replaceTerm || !editorRef.current) return;
    
    const content = editorRef.current.innerHTML;
    const regex = new RegExp(searchTerm, 'g');
    const newContent = content.replace(regex, replaceTerm);
    editorRef.current.innerHTML = newContent;
    setBlogData(prev => ({ ...prev, content: newContent }));
    setFindCount(0);
    setCurrentFindIndex(-1);
  };

  // Insert special characters
  const insertSpecialCharacter = (char: string) => {
    document.execCommand('insertText', false, char);
    editorRef.current?.focus();
    handleContentChange();
  };

  // Insert table
  const insertTable = (rows: number, cols: number) => {
    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">';
    for (let i = 0; i < rows; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < cols; j++) {
        const isHeader = i === 0;
        tableHtml += isHeader ? 
          `<th style="border: 1px solid #ddd; padding: 8px; background: #f4f4f4; text-align: left;">Header ${j+1}</th>` :
          `<td style="border: 1px solid #ddd; padding: 8px;">Cell ${i+1}${j+1}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    document.execCommand('insertHTML', false, tableHtml);
    editorRef.current?.focus();
    handleContentChange();
  };

  // Insert template
  const insertTemplate = (type: string) => {
    const templates: Record<string, string> = {
      'blog-intro': '<p style="font-size: 18px; color: #2c3e50; font-weight: 500;">Welcome to this comprehensive guide where we explore the topic in depth.</p>',
      'blog-conclusion': '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db;"><p style="margin: 0; font-size: 16px;"><strong>Key Takeaways:</strong></p><ul><li>Key point 1</li><li>Key point 2</li><li>Key point 3</li></ul></div>',
      'call-to-action': '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px; text-align: center; color: white;"><h3 style="color: white; margin: 0 0 10px;">Ready to Learn More?</h3><p style="margin: 0 0 15px;">Join our community of learners today!</p><button style="background: white; color: #764ba2; border: none; padding: 10px 30px; border-radius: 25px; cursor: pointer; font-weight: bold;">Get Started</button></div>',
      'info-box': '<div style="background: #e3f2fd; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 10px 0;"><p style="margin: 0; color: #1565c0;"><strong>📝 Note:</strong> Add your important information here.</p></div>',
      'warning-box': '<div style="background: #fff3e0; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #ff9800; margin: 10px 0;"><p style="margin: 0; color: #e65100;"><strong>⚠️ Warning:</strong> Important notice or warning message.</p></div>',
      'success-box': '<div style="background: #e8f5e9; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 10px 0;"><p style="margin: 0; color: #2e7d32;"><strong>✅ Success:</strong> Congratulations on your achievement!</p></div>',
      'two-column': '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;"><div style="background: #f5f5f5; padding: 15px; border-radius: 8px;"><h4>Column 1</h4><p>Content for column 1</p></div><div style="background: #f5f5f5; padding: 15px; border-radius: 8px;"><h4>Column 2</h4><p>Content for column 2</p></div></div>',
    };
    
    const templateHtml = templates[type] || '';
    if (templateHtml) {
      document.execCommand('insertHTML', false, templateHtml);
      editorRef.current?.focus();
      handleContentChange();
    }
  };

  // Export content
  const exportContent = (format: 'html' | 'txt' | 'json') => {
    const content = blogData.content;
    const textContent = content.replace(/<[^>]*>/g, "");
    
    switch(format) {
      case 'html':
        navigator.clipboard.writeText(content);
        alert('HTML content copied to clipboard!');
        break;
      case 'txt':
        navigator.clipboard.writeText(textContent);
        alert('Text content copied to clipboard!');
        break;
      case 'json':
        const jsonData = JSON.stringify({ content, wordCount, charCount, readingTime: blogData.readingTime }, null, 2);
        navigator.clipboard.writeText(jsonData);
        alert('JSON data copied to clipboard!');
        break;
    }
  };

  // Print content
  const printContent = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Blog Content</title></head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
            ${blogData.content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // PDF Management
  const addPdf = () => {
    if (!pdfTitle.trim()) {
      alert('Please enter a PDF title');
      return;
    }

    let fileData = null;
    if (pdfFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPdf = {
          title: pdfTitle.trim(),
          file: reader.result as string,
          url: pdfUrl.trim() || ''
        };
        setBlogData(prev => ({
          ...prev,
          pdfs: [...(prev.pdfs || []), newPdf]
        }));
        setPdfTitle('');
        setPdfFile(null);
        setPdfUrl('');
        setShowPdfModal(false);
      };
      reader.readAsDataURL(pdfFile);
    } else {
      const newPdf = {
        title: pdfTitle.trim(),
        file: null,
        url: pdfUrl.trim() || ''
      };
      setBlogData(prev => ({
        ...prev,
        pdfs: [...(prev.pdfs || []), newPdf]
      }));
      setPdfTitle('');
      setPdfFile(null);
      setPdfUrl('');
      setShowPdfModal(false);
    }
  };

  const removePdf = (index: number) => {
    setBlogData(prev => ({
      ...prev,
      pdfs: (prev.pdfs || []).filter((_, i) => i !== index)
    }));
  };

  // Link Management
  const addLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) {
      alert('Please enter both title and URL');
      return;
    }

    setBlogData(prev => ({
      ...prev,
      links: [...(prev.links || []), { title: linkTitle.trim(), url: linkUrl.trim() }]
    }));
    setLinkTitle('');
    setLinkUrl('');
    setShowLinkModal(false);
  };

  const removeLink = (index: number) => {
    setBlogData(prev => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index)
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const imageHtml = `<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />`;
        
        if (editorRef.current) {
          document.execCommand('insertHTML', false, imageHtml);
          handleContentChange();
        } else {
          setBlogData(prev => ({ ...prev, content: prev.content + imageHtml }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle banner upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
        setBlogData(prev => ({ ...prev, banner: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply code to design
  const applyCodeToDesign = () => {
    if (codeContent.trim()) {
      setBlogData(prev => ({ ...prev, content: codeContent }));
      setViewMode('design');
    }
  };

  // Toggle FAQ accordion
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Generate full HTML source
  const generateFullSource = () => {
    const pdfs = blogData.pdfs || [];
    const links = blogData.links || [];
    
    const resourcesHtml = (pdfs.length > 0 || links.length > 0) ? `
      <div style="margin: 40px 0; padding: 28px 32px; background: #f8f9fa; border-radius: 16px; border: 1px solid #e9ecef;">
        <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 20px 0;">📚 Resources & Downloads</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          ${pdfs.map(pdf => `
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e9ecef; overflow: hidden;">
              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="width: 48px; height: 48px; border-radius: 10px; background: #fff5f5; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">📄</div>
                <div style="min-width: 0; flex: 1;">
                  <strong style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${pdf.title}</strong>
                </div>
              </div>
              <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                ${pdf.file ? '<button style="padding: 6px 16px; background: #28a745; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 13px;">⬇️ Download</button>' : ''}
                ${pdf.url ? `<a href="${pdf.url}" target="_blank" style="padding: 6px 16px; background: #007bff; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; text-decoration: none; display: inline-block;">🔗 View</a>` : ''}
              </div>
            </div>
          `).join('')}
          ${links.map(link => `
            <a href="${link.url}" target="_blank" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e9ecef; text-decoration: none; color: inherit; display: block; overflow: hidden;">
              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="width: 48px; height: 48px; border-radius: 10px; background: #f0f7ff; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">🔗</div>
                <div style="min-width: 0; flex: 1;">
                  <strong style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${link.title}</strong>
                </div>
              </div>
              <div style="margin-top: 12px; padding: 6px 16px; background: #e9ecef; border-radius: 8px; display: inline-block; font-size: 13px;">Visit Resource ↗</div>
            </a>
          `).join('')}
        </div>
      </div>
    ` : '';

    const faqHtml = (blogData.faq || []).length > 0 ? `
      <div style="margin: 40px 0; padding: 32px 32px 28px 32px; background: #f8f9fa; border-radius: 16px; border: 1px solid #e9ecef;">
        <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 24px 0;">❓ Frequently Asked Questions</h2>
        ${(blogData.faq || []).map(item => `
          <div style="background: white; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; border: 1px solid #e9ecef;">
            <div style="font-weight: 600; font-size: 15px; color: #1a1a1a;">${item.question}</div>
            <div style="margin-top: 8px; color: #495057; font-size: 15px; line-height: 1.7;">${item.answer}</div>
          </div>
        `).join('')}
      </div>
    ` : '';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${blogData.title}</title>
  <meta name="description" content="${blogData.metaDescription}">
  <meta name="keywords" content="${blogData.metaKeywords}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 40px 24px; background: #fff; }
    h1 { font-size: 40px; font-weight: 700; margin-bottom: 0.5em; color: #1a1a1a; letter-spacing: -0.5px; }
    h2 { font-size: 28px; margin: 1.5em 0 0.5em; color: #2c3e50; }
    h3 { font-size: 22px; margin: 1.2em 0 0.5em; color: #34495e; }
    p { margin-bottom: 1em; line-height: 1.8; }
    img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
    blockquote { border-left: 4px solid #3498db; padding: 15px 20px; margin: 20px 0; background: #f8f9fa; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
    ul, ol { margin: 15px 0 15px 25px; }
    li { margin-bottom: 0.5em; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #f4f4f4; font-weight: bold; }
    .banner { width: 100%; border-radius: 16px; margin: 20px 0; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .banner-caption { text-align: center; color: #888; font-style: italic; margin: 10px 0 20px; }
    .meta { color: #888; font-size: 0.9em; margin: 10px 0; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0 20px; }
    .tag { background: #e9ecef; padding: 4px 14px; border-radius: 20px; font-size: 0.85em; color: #495057; }
    .category-badge { background: #ebf5ff; color: #3498db; padding: 4px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
    .reading-time { background: #f8f9fa; padding: 4px 14px; border-radius: 20px; font-size: 14px; color: #6c757d; }
    .author-avatar { width: 36px; height: 36px; border-radius: 50%; background: #e9ecef; display: inline-flex; align-items: center; justify-content: center; font-weight: 600; }
    .seo-panel { margin-top: 40px; padding: 24px 28px; background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef; }
    .seo-panel h3 { margin-top: 0; font-size: 16px; }
    .seo-item { padding: 8px 12px; background: white; border-radius: 8px; border: 1px solid #e9ecef; margin-bottom: 8px; }
    .seo-label { color: #6c757d; font-size: 12px; font-weight: 500; }
    .seo-value { color: #1a1a1a; }
    .faq-section { margin: 40px 0; padding: 32px 32px 28px 32px; background: #f8f9fa; border-radius: 16px; border: 1px solid #e9ecef; }
    .faq-item { background: white; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; border: 1px solid #e9ecef; }
    .faq-item .question { font-weight: 600; font-size: 15px; color: #1a1a1a; }
    .faq-item .answer { margin-top: 8px; color: #495057; font-size: 15px; line-height: 1.7; }
    .resources-section { margin: 40px 0; padding: 28px 32px; background: #f8f9fa; border-radius: 16px; border: 1px solid #e9ecef; }
    .resource-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .resource-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e9ecef; overflow: hidden; }
    .resource-card .title { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  </style>
</head>
<body>
  <article>
    <header style="margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #f0f2f5;">
      ${bannerPreview ? `<img src="${bannerPreview}" alt="Banner" class="banner" />` : ''}
      ${blogData.bannerCaption ? `<p class="banner-caption">${blogData.bannerCaption}</p>` : ''}
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <span class="category-badge">${blogData.category || "Category"}</span>
        <span class="reading-time">⏱️ ${blogData.readingTime || 0} min read</span>
      </div>
      
      <h1>${blogData.title}</h1>
      
      <div style="display: flex; gap: 28px; color: #6c757d; font-size: 14px; flex-wrap: wrap; margin-bottom: 14px;">
        <span style="display: flex; align-items: center; gap: 8px;">
          <span class="author-avatar">${blogData.author.charAt(0).toUpperCase()}</span>
          <span>By <strong>${blogData.author || "Author"}</strong></span>
        </span>
        <span>📅 ${blogData.publishDate || "Date"}</span>
      </div>
      
      ${(blogData.tags || []).length > 0 ? `
        <div class="tags">
          ${(blogData.tags || []).map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>
      ` : ''}
    </header>
    
    ${resourcesHtml}
    
    <div style="margin: 40px 0;">
      ${blogData.content}
    </div>
    
    ${faqHtml}
    
    <div class="seo-panel">
      <h3>🔍 SEO Metadata</h3>
      <div class="seo-item">
        <div class="seo-label">Meta Title</div>
        <div class="seo-value">${blogData.metaTitle || "Not set"}</div>
      </div>
      <div class="seo-item">
        <div class="seo-label">Slug / Canonical URL</div>
        <div class="seo-value">${blogData.slug ? `/${blogData.slug}` : "Not set"}</div>
      </div>
      <div class="seo-item">
        <div class="seo-label">Meta Description</div>
        <div class="seo-value">${blogData.metaDescription || "Not set"}</div>
      </div>
      <div class="seo-item">
        <div class="seo-label">Keywords</div>
        <div class="seo-value" style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${blogData.metaKeywords ? blogData.metaKeywords.split(',').map(kw => 
            `<span style="background: #e9ecef; padding: 2px 10px; border-radius: 12px; font-size: 12px; color: #495057;">${kw.trim()}</span>`
          ).join('') : "Not set"}
        </div>
      </div>
    </div>
  </article>
</body>
</html>`;
  };

  // Render full page preview - FIXED VERSION
  const renderFullPagePreview = () => {
    const pdfs = blogData.pdfs || [];
    const links = blogData.links || [];
    const faqs = blogData.faq || [];
    
    return (
      <div 
        ref={fullScreenRef}
        style={{ 
          maxWidth: 900, 
          margin: "0 auto", 
          padding: "40px 24px", 
          background: "#fff", 
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ============================================ */
        /* 1. HERO SECTION - Banner and Basic Info */
        /* ============================================ */}
        <section style={{ 
          marginBottom: 48,
          paddingBottom: 32,
          borderBottom: "2px solid #f0f2f5",
          flexShrink: 0,
        }}>
          {/* Banner Image */}
          {bannerPreview && (
            <div style={{ 
              marginBottom: 28,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}>
              <img 
                src={bannerPreview} 
                alt="Blog banner" 
                style={{ 
                  width: "100%", 
                  maxHeight: 420, 
                  objectFit: "cover",
                  display: "block",
                }} 
              />
              {blogData.bannerCaption && (
                <p style={{ 
                  padding: "10px 20px",
                  margin: 0,
                  background: "#f8f9fa",
                  textAlign: "center", 
                  color: "#6c757d", 
                  fontSize: 14, 
                  fontStyle: "italic" 
                }}>
                  {blogData.bannerCaption}
                </p>
              )}
            </div>
          )}

          {/* Category and Reading Time */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 8,
          }}>
            <span style={{ 
              color: "#3498db", 
              fontWeight: "600", 
              textTransform: "uppercase", 
              fontSize: 13,
              letterSpacing: "0.5px",
              background: "#ebf5ff",
              padding: "4px 16px",
              borderRadius: 20,
            }}>
              {blogData.category || "Category"}
            </span>
            <span style={{ 
              color: "#6c757d", 
              fontSize: 14, 
              display: "flex", 
              alignItems: "center", 
              gap: 6,
              background: "#f8f9fa",
              padding: "4px 14px",
              borderRadius: 20,
            }}>
              <span>⏱️</span> {blogData.readingTime || 0} min read
            </span>
          </div>
          
          {/* Title */}
          <h1 style={{ 
            fontSize: 40, 
            fontWeight: "700", 
            margin: "8px 0 14px 0", 
            color: "#1a1a1a",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
          }}>
            {blogData.title || "Blog Title"}
          </h1>
          
          {/* Author and Date */}
          <div style={{ 
            display: "flex", 
            gap: 28, 
            color: "#6c757d", 
            fontSize: 14, 
            flexWrap: "wrap",
            marginBottom: 14,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ 
                width: 36, 
                height: 36, 
                borderRadius: "50%", 
                background: "#e9ecef",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: "600",
                color: "#495057",
              }}>
                {blogData.author.charAt(0).toUpperCase()}
              </span>
              <span>By <strong>{blogData.author || "Author"}</strong></span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>📅</span> {blogData.publishDate || "Date"}
            </span>
          </div>
          
          {/* Tags */}
          {(blogData.tags || []).length > 0 && (
            <div style={{ 
              display: "flex", 
              gap: 8, 
              marginTop: 8, 
              flexWrap: "wrap" 
            }}>
              {(blogData.tags || []).map(tag => (
                <span key={tag} style={{ 
                  background: "#e9ecef", 
                  padding: "4px 14px", 
                  borderRadius: 20, 
                  fontSize: 12, 
                  color: "#495057",
                  fontWeight: 500,
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ============================================ */
        /* 2. RESOURCES SECTION - Modern Cards with Fix */
        /* ============================================ */}
        {(pdfs.length > 0 || links.length > 0) && (
          <section style={{ 
            marginBottom: 48,
            padding: "28px 32px 32px 32px",
            background: "#f8f9fa",
            borderRadius: 16,
            border: "1px solid #e9ecef",
            flexShrink: 0,
          }}>
            <h2 style={{ 
              fontSize: 22, 
              fontWeight: "600",
              margin: "0 0 20px 0",
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{ fontSize: 24 }}>📚</span> Resources & Downloads
            </h2>

            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}>
              {/* PDF Resources - Cards with truncated titles */}
              {pdfs.map((pdf, idx) => (
                <div 
                  key={`pdf-${idx}`}
                  style={{
                    background: "white",
                    borderRadius: 12,
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    border: "1px solid #e9ecef",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    cursor: "default",
                    overflow: "hidden",
                    minWidth: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, minWidth: 0 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      background: "#fff5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}>
                      📄
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ 
                        fontSize: 15, 
                        fontWeight: "600",
                        margin: "0 0 4px 0",
                        color: "#1a1a1a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {pdf.title}
                      </h4>
                      <p style={{
                        fontSize: 13,
                        color: "#6c757d",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {pdf.url ? "Downloadable resource" : "PDF document attached"}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                    {pdf.file && (
                      <button style={{
                        padding: "6px 16px",
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: "500",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#218838"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#28a745"}
                      >
                        ⬇️ Download
                      </button>
                    )}
                    {pdf.url && (
                      <a 
                        href={pdf.url} 
                        target="_blank" 
                        style={{
                          padding: "6px 16px",
                          background: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: "500",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#0069d9"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#007bff"}
                      >
                        🔗 View
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* Link Resources - Cards with truncated titles */}
              {links.map((link, idx) => (
                <a 
                  key={`link-${idx}`}
                  href={link.url} 
                  target="_blank"
                  style={{
                    background: "white",
                    borderRadius: 12,
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    border: "1px solid #e9ecef",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "inherit",
                    overflow: "hidden",
                    minWidth: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "#007bff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#e9ecef";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, minWidth: 0 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      background: "#f0f7ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}>
                      🔗
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ 
                        fontSize: 15, 
                        fontWeight: "600",
                        margin: "0 0 4px 0",
                        color: "#1a1a1a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {link.title}
                      </h4>
                      <p style={{
                        fontSize: 13,
                        color: "#6c757d",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        Visit this resource ↗
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <span style={{
                      padding: "6px 16px",
                      background: "#e9ecef",
                      color: "#495057",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}>
                      🔗 Visit Resource
                      <span style={{ fontSize: 12 }}>↗</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ============================================ */
        /* 3. MAIN CONTENT - Dynamic CMS Content */
        /* ============================================ */}
        <section style={{ 
          marginBottom: 48,
          padding: "0",
          flex: "0 1 auto",
        }}>
          <div 
            ref={previewRef}
            style={{ 
              lineHeight: 1.8, 
              fontSize: 17, 
              color: "#333",
              maxWidth: "100%",
              overflowWrap: "break-word",
              wordWrap: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: blogData.content }}
          />
        </section>

        {/* ============================================ */
        /* 4. FAQ SECTION - Modern Accordion */
        /* ============================================ */}
        {faqs.length > 0 && (
          <section style={{ 
            marginBottom: 48,
            padding: "32px 32px 28px 32px", 
            background: "#f8f9fa", 
            borderRadius: 16,
            border: "1px solid #e9ecef",
            flexShrink: 0,
          }}>
            <h2 style={{ 
              fontSize: 24, 
              fontWeight: "600",
              margin: "0 0 24px 0", 
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{ fontSize: 28 }}>❓</span> Frequently Asked Questions
            </h2>
            
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              gap: 8,
            }}>
              {faqs.map((item, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      background: "white",
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      border: `1px solid ${isExpanded ? '#007bff' : '#e9ecef'}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textAlign: "left",
                        fontSize: 15,
                        fontWeight: isExpanded ? "600" : "500",
                        color: isExpanded ? "#007bff" : "#1a1a1a",
                        transition: "all 0.2s",
                      }}
                    >
                      <span style={{ flex: 1, paddingRight: 12 }}>
                        {item.question}
                      </span>
                      <span style={{ 
                        fontSize: 20,
                        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        color: isExpanded ? "#007bff" : "#6c757d",
                        flexShrink: 0,
                      }}>
                        ▼
                      </span>
                    </button>
                    <div
                      style={{
                        maxHeight: isExpanded ? "500px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease",
                        padding: isExpanded ? "0 20px 20px 20px" : "0 20px",
                      }}
                    >
                      <p style={{ 
                        margin: 0, 
                        color: "#495057", 
                        fontSize: 15,
                        lineHeight: 1.7,
                      }}>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================ */
        /* 5. SEO META - Admin Panel */
        /* ============================================ */}
        <footer style={{ 
          marginTop: 8,
          padding: "24px 28px",
          background: "#f8f9fa",
          borderRadius: 12,
          border: "1px solid #e9ecef",
          flexShrink: 0,
        }}>
          <h3 style={{ 
            fontSize: 16, 
            fontWeight: "600",
            margin: "0 0 16px 0",
            color: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>🔍</span> SEO Metadata
          </h3>
          
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 24px",
            fontSize: 14,
          }}>
            <div style={{ 
              padding: "8px 12px",
              background: "white",
              borderRadius: 8,
              border: "1px solid #e9ecef",
            }}>
              <div style={{ color: "#6c757d", fontSize: 12, fontWeight: "500", marginBottom: 2 }}>
                Meta Title
              </div>
              <div style={{ color: "#1a1a1a", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {blogData.metaTitle || "Not set"}
              </div>
            </div>
            
            <div style={{ 
              padding: "8px 12px",
              background: "white",
              borderRadius: 8,
              border: "1px solid #e9ecef",
            }}>
              <div style={{ color: "#6c757d", fontSize: 12, fontWeight: "500", marginBottom: 2 }}>
                Slug / Canonical URL
              </div>
              <div style={{ color: "#1a1a1a", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {blogData.slug ? `/${blogData.slug}` : "Not set"}
              </div>
            </div>
            
            <div style={{ 
              gridColumn: "1 / -1",
              padding: "8px 12px",
              background: "white",
              borderRadius: 8,
              border: "1px solid #e9ecef",
            }}>
              <div style={{ color: "#6c757d", fontSize: 12, fontWeight: "500", marginBottom: 2 }}>
                Meta Description
              </div>
              <div style={{ color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {blogData.metaDescription || "Not set"}
              </div>
            </div>
            
            <div style={{ 
              gridColumn: "1 / -1",
              padding: "8px 12px",
              background: "white",
              borderRadius: 8,
              border: "1px solid #e9ecef",
            }}>
              <div style={{ color: "#6c757d", fontSize: 12, fontWeight: "500", marginBottom: 2 }}>
                Keywords
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {blogData.metaKeywords ? (
                  blogData.metaKeywords.split(',').map((kw, i) => (
                    <span key={i} style={{
                      background: "#e9ecef",
                      padding: "2px 10px",
                      borderRadius: 12,
                      fontSize: 12,
                      color: "#495057",
                    }}>
                      {kw.trim()}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#6c757d" }}>Not set</span>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    const fullHtml = generateFullSource();
    const output = {
      blog: blogData,
      htmlSource: fullHtml,
      statistics: {
        wordCount,
        charCount,
        readingTime: blogData.readingTime,
        elementCount: blogData.content.match(/<[^>]+>/g)?.length || 0,
        pdfCount: (blogData.pdfs || []).length,
        linkCount: (blogData.links || []).length,
      },
      timestamp: new Date().toISOString(),
    };
    
    console.log("Blog Data:", JSON.stringify(output, null, 2));
    
    navigator.clipboard.writeText(fullHtml).then(() => {
      alert("✅ Full HTML source code copied to clipboard!\n\nCheck console for full data.");
    }).catch(() => {
      alert("📋 Blog data generated! Check console for JSON output.");
    });
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !(blogData.tags || []).includes(tagInput.trim())) {
      setBlogData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setBlogData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }));
  };

  // Add FAQ
  const addFaq = () => {
    if (faqQuestion.trim() && faqAnswer.trim()) {
      setBlogData(prev => ({
        ...prev,
        faq: [...(prev.faq || []), { question: faqQuestion.trim(), answer: faqAnswer.trim() }]
      }));
      setFaqQuestion("");
      setFaqAnswer("");
    }
  };

  // Remove FAQ
  const removeFaq = (index: number) => {
    setBlogData(prev => ({
      ...prev,
      faq: (prev.faq || []).filter((_, i) => i !== index)
    }));
  };

  // Generate slug
  const generateSlug = () => {
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setBlogData(prev => ({ ...prev, slug }));
  };

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowFindReplace(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowFindReplace(true);
        setIsReplaceMode(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setShowFindReplace(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // NEW: Panel resize handlers
  const startDragging = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const onDrag = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const container = document.getElementById('editor-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const newWidth = e.clientX - rect.left;
    
    // Constrain width between 200px and 600px
    const constrainedWidth = Math.max(200, Math.min(600, newWidth));
    setLeftPanelWidth(constrainedWidth);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDragging);
    }
    
    return () => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDragging);
    };
  }, [isDragging, onDrag, stopDragging]);

  // Toolbar button style
  const toolButtonStyle: React.CSSProperties = {
    padding: '5px 10px',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: '#333',
    transition: 'all 0.2s',
    minWidth: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Toolbar group style
  const toolbarGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '0 4px',
    borderRight: '1px solid #ddd',
  };

  // Safely get array length
  const getPdfCount = () => (blogData.pdfs || []).length;
  const getLinkCount = () => (blogData.links || []).length;
  const getTagCount = () => (blogData.tags || []).length;
  const getFaqCount = () => (blogData.faq || []).length;

  return (
    <div style={{ 
      maxWidth: '100%',
      margin: "0 auto", 
      padding: '16px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#f0f2f5',
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        background: 'white',
        borderRadius: '12px',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flexShrink: 0,
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>
          📝 Blog Editor
        </h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              padding: "6px 16px",
              background: showPreview ? "#dc3545" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {showPreview ? "✕ Close" : "👁️ Preview"}
          </button>
          {showPreview && (
            <button
              onClick={toggleFullScreen}
              style={{
                padding: "6px 16px",
                background: isFullScreen ? "#dc3545" : "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {isFullScreen ? "⛶ Exit" : "⛶ Full"}
            </button>
          )}
          <button
            onClick={() => setViewMode(viewMode === 'design' ? 'code' : 'design')}
            style={{
              padding: "6px 16px",
              background: viewMode === 'design' ? "#6c757d" : "#17a2b8",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {viewMode === 'design' ? '💻 Code' : '🎨 Design'}
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "6px 16px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            📋 Export
          </button>
        </div>
      </div>

      {showPreview ? (
        // Full page preview
        <div style={{ 
          flex: 1,
          background: "#f5f5f5", 
          padding: '16px', 
          borderRadius: '12px', 
          overflow: 'auto',
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: "2px solid #e0e0e0",
          }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: "#2c3e50" }}>
              📄 Full Page Preview
            </h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: 'wrap' }}>
              <span style={{ 
                background: "#e9ecef", 
                padding: "4px 12px", 
                borderRadius: "20px",
                fontSize: "12px",
                color: "#495057",
              }}>
                📝 {blogData.readingTime} min read
              </span>
              <span style={{ 
                background: "#e9ecef", 
                padding: "4px 12px", 
                borderRadius: "20px",
                fontSize: "12px",
                color: "#495057",
              }}>
                📊 {wordCount} words
              </span>
              {getPdfCount() > 0 && (
                <span style={{ 
                  background: "#e9ecef", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "#495057",
                }}>
                  📄 {getPdfCount()} PDFs
                </span>
              )}
              {getLinkCount() > 0 && (
                <span style={{ 
                  background: "#e9ecef", 
                  padding: "4px 12px", 
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "#495057",
                }}>
                  🔗 {getLinkCount()} Links
                </span>
              )}
            </div>
          </div>
          <div style={{ 
            background: "#fff", 
            borderRadius: '8px', 
            overflow: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            maxHeight: 'calc(100vh - 250px)',
          }}>
            {renderFullPagePreview()}
          </div>
        </div>
      ) : (
        // Main editor interface with resizable panels
        <div 
          id="editor-container"
          style={{ 
            display: 'flex',
            gap: '0',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Left Panel - Form Inputs with dynamic width */}
          <div style={{ 
            width: leftPanelWidth,
            minWidth: 200,
            maxWidth: 600,
            overflowY: 'auto',
            paddingRight: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flexShrink: 0,
            background: '#f0f2f5',
            padding: '4px',
          }}>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: 'white',
              padding: '4px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              flexShrink: 0,
            }}>
              {['editor', 'media', 'settings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    background: activeTab === tab ? '#007bff' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#666',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab === 'editor' && '✏️ Editor'}
                  {tab === 'media' && '📎 Media'}
                  {tab === 'settings' && '⚙️ Settings'}
                </button>
              ))}
            </div>

            {/* Editor Tab */}
            {activeTab === 'editor' && (
              <>
                {/* Basic Info */}
                <div style={{ padding: '12px', border: "1px solid #ddd", borderRadius: "8px", background: "#fff", boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '10px', color: "#2c3e50" }}>📝 Basic Info</h3>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: "block", marginBottom: '4px', fontSize: '11px', fontWeight: 500 }}>Title *</label>
                    <input
                      type="text"
                      value={blogData.title}
                      onChange={(e) => setBlogData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter blog title"
                      style={{ width: "100%", padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: '8px' }}>
                    <div>
                      <label style={{ display: "block", marginBottom: '4px', fontSize: '11px', fontWeight: 500 }}>Author</label>
                      <input
                        type="text"
                        value={blogData.author}
                        onChange={(e) => setBlogData(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Author"
                        style={{ width: "100%", padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: '4px', fontSize: '11px', fontWeight: 500 }}>Date</label>
                      <input
                        type="date"
                        value={blogData.publishDate}
                        onChange={(e) => setBlogData(prev => ({ ...prev, publishDate: e.target.value }))}
                        style={{ width: "100%", padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <label style={{ display: "block", marginBottom: '4px', fontSize: '11px', fontWeight: 500 }}>Category</label>
                    <select
                      value={blogData.category}
                      onChange={(e) => setBlogData(prev => ({ ...prev, category: e.target.value }))}
                      style={{ width: "100%", padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px' }}
                    >
                      <option>NCERT Solutions</option>
                      <option>RD Sharma Solutions</option>
                      <option>Blogs</option>
                      <option>Articles</option>
                      <option>CBSE Board</option>
                      <option>IIT JEE</option>
                      <option>NEET</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <label style={{ display: "block", marginBottom: '4px', fontSize: '11px', fontWeight: 500 }}>Tags</label>
                    <div style={{ display: "flex", gap: '4px' }}>
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tag"
                        style={{ flex: 1, padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px' }}
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <button
                        onClick={addTag}
                        style={{
                          padding: "6px 12px",
                          background: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: '13px',
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: '4px', flexWrap: "wrap", marginTop: '4px' }}>
                      {(blogData.tags || []).map(tag => (
                        <span key={tag} style={{ background: "#e9ecef", padding: "2px 8px", borderRadius: "12px", fontSize: '11px', display: "flex", alignItems: "center", gap: "4px" }}>
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            style={{ background: "none", border: "none", color: "#dc3545", cursor: "pointer", fontSize: '14px', padding: '0 2px' }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={blogData.featured}
                        onChange={(e) => setBlogData(prev => ({ ...prev, featured: e.target.checked }))}
                        style={{ width: '14px', height: '14px' }}
                      />
                      Featured Post
                    </label>
                  </div>
                </div>

                {/* FAQ */}
                <div style={{ padding: '12px', border: "1px solid #ddd", borderRadius: "8px", background: "#fff", boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '10px', color: "#2c3e50" }}>❓ FAQ</h3>
                  <div style={{ marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="Question"
                      style={{ width: "100%", padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px', marginBottom: '4px' }}
                    />
                    <textarea
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      placeholder="Answer"
                      rows={2}
                      style={{ width: "100%", padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px', marginBottom: '4px' }}
                    />
                    <button
                      onClick={addFaq}
                      style={{
                        width: "100%",
                        padding: "6px",
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: '13px',
                      }}
                    >
                      Add FAQ
                    </button>
                  </div>
                  {(blogData.faq || []).map((item, idx) => (
                    <div key={idx} style={{ padding: '6px', background: "#f8f9fa", borderRadius: "4px", marginBottom: '4px' }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '12px' }}>{item.question}</strong>
                          <p style={{ fontSize: '11px', color: "#666", margin: "2px 0 0" }}>{item.answer}</p>
                        </div>
                        <button
                          onClick={() => removeFaq(idx)}
                          style={{
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "2px 6px",
                            cursor: "pointer",
                            fontSize: '11px',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <>
                {/* PDF Upload */}
                <div style={{ padding: '12px', border: "1px solid #ddd", borderRadius: "8px", background: "#fff", boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '10px', color: "#2c3e50" }}>📄 PDF Resources</h3>
                  <button
                    onClick={() => setShowPdfModal(true)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    + Add PDF
                  </button>
                  {(blogData.pdfs || []).map((pdf, idx) => (
                    <div key={idx} style={{ padding: '8px', background: "#f8f9fa", borderRadius: "4px", marginTop: '6px' }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '12px' }}>{pdf.title}</strong>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                            {pdf.file && <span style={{ fontSize: '11px', color: '#28a745' }}>📎 PDF</span>}
                            {pdf.url && <span style={{ fontSize: '11px', color: '#007bff' }}>🔗 Link</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => removePdf(idx)}
                          style={{
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "2px 8px",
                            cursor: "pointer",
                            fontSize: '12px',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Links */}
                <div style={{ padding: '12px', border: "1px solid #ddd", borderRadius: "8px", background: "#fff", boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '10px', color: "#2c3e50" }}>🔗 Useful Links</h3>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#17a2b8",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    + Add Link
                  </button>
                  {(blogData.links || []).map((link, idx) => (
                    <div key={idx} style={{ padding: '8px', background: "#f8f9fa", borderRadius: "4px", marginTop: '6px' }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <a href={link.url} target="_blank" style={{ fontSize: '12px', color: '#007bff', textDecoration: 'none' }}>
                            {link.title}
                          </a>
                        </div>
                        <button
                          onClick={() => removeLink(idx)}
                          style={{
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "2px 8px",
                            cursor: "pointer",
                            fontSize: '12px',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Banner */}
                <div style={{ padding: '12px', border: "1px solid #ddd", borderRadius: "8px", background: "#fff", boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '10px', color: "#2c3e50" }}>🖼️ Banner</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    style={{ width: "100%", fontSize: '12px' }}
                  />
                  {bannerPreview && (
                    <div style={{ marginTop: '6px' }}>
                      <img src={bannerPreview} alt="Banner" style={{ width: "100%", maxHeight: '100px', objectFit: "cover", borderRadius: "4px" }} />
                    </div>
                  )}
                  <div style={{ marginTop: '6px' }}>
                    <input
                      type="text"
                      value={blogData.bannerCaption}
                      onChange={(e) => setBlogData(prev => ({ ...prev, bannerCaption: e.target.value }))}
                      placeholder="Banner caption"
                      style={{ width: "100%", padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <>
                {/* SEO Meta */}
                <div style={{ padding: '12px', border: "1px solid #ddd", borderRadius: "8px", background: "#fff", boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '10px', color: "#2c3e50" }}>🔍 SEO Meta</h3>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: "block", marginBottom: '4px', fontSize: '11px', fontWeight: 500 }}>Meta Title</label>
                    <input
                      type="text"
                      value={blogData.metaTitle}
                      onChange={(e) => setBlogData(prev => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="Meta title"
                      style={{ width: "100%", padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px' }}
                    />
                    <small style={{ color: '#888', fontSize: '10px' }}>{blogData.metaTitle.length}/60</small>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: "block", marginBottom: '4px', fontSize: '11px', fontWeight: 500 }}>Meta Description</label>
                    <textarea
                      value={blogData.metaDescription}
                      onChange={(e) => setBlogData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="Meta description"
                      rows={2}
                      style={{ width: "100%", padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px' }}
                    />
                    <small style={{ color: '#888', fontSize: '10px' }}>{blogData.metaDescription.length}/160</small>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: '4px', fontSize: '11px', fontWeight: 500 }}>Slug</label>
                    <div style={{ display: "flex", gap: '4px' }}>
                      <input
                        type="text"
                        value={blogData.slug}
                        onChange={(e) => setBlogData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="URL slug"
                        style={{ flex: 1, padding: '6px 10px', border: "1px solid #ccc", borderRadius: "4px", fontSize: '13px' }}
                      />
                      <button
                        onClick={generateSlug}
                        style={{
                          padding: "6px 12px",
                          background: "#6c757d",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: '13px',
                        }}
                      >
                        Gen
                      </button>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div style={{ padding: '12px', border: "1px solid #ddd", borderRadius: "8px", background: "#fff", boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '14px', marginBottom: '10px', color: "#2c3e50" }}>📊 Statistics</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ background: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>{wordCount}</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>Words</div>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>{charCount}</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>Characters</div>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#17a2b8' }}>{blogData.readingTime}</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>Min Read</div>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6c757d' }}>{history.length}</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>Versions</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Resizable Divider */}
          <div
            ref={dividerRef}
            onMouseDown={startDragging}
            style={{
              width: '6px',
              cursor: 'col-resize',
              flexShrink: 0,
              background: isDragging ? '#007bff' : 'transparent',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              if (!isDragging) {
                e.currentTarget.style.background = '#dee2e6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isDragging) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <div style={{
              width: '2px',
              height: '40px',
              background: isDragging ? '#007bff' : '#adb5bd',
              borderRadius: '2px',
              transition: 'all 0.2s',
              opacity: isDragging ? 1 : 0.5,
            }} />
          </div>

          {/* Right Panel - Editor */}
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
            minWidth: 0,
          }}>
            <div style={{ 
              flex: 1,
              border: "1px solid #ddd", 
              borderRadius: "8px", 
              background: "#fff",
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              {/* Editor Header */}
              <div style={{ 
                padding: '8px 16px',
                borderBottom: "1px solid #ddd",
                background: '#fafafa',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                <h3 style={{ fontSize: '15px', margin: 0, color: "#2c3e50" }}>
                  {viewMode === 'design' ? '✏️ Design Editor' : '💻 Code Editor'}
                </h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {showWordCount && (
                    <>
                      <span style={{ fontSize: '11px', color: '#666' }}>
                        📝 {wordCount} words
                      </span>
                      <span style={{ fontSize: '11px', color: '#666' }}>
                        ⏱️ {blogData.readingTime} min
                      </span>
                      <span style={{ fontSize: '11px', color: '#666' }}>
                        🔄 {history.length} versions
                      </span>
                    </>
                  )}
                </div>
              </div>

              {viewMode === 'design' ? (
                // Design View - MS Word Style Editor
                <>
                  {/* MS Word Style Toolbar */}
                  <div style={{
                    padding: '4px 8px',
                    background: '#f8f9fa',
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2px',
                    alignItems: 'center',
                    flexShrink: 0,
                    maxHeight: '100px',
                    overflowY: 'auto',
                  }}>
                    {/* Font Styles */}
                    <div style={toolbarGroupStyle}>
                      <select
                        onChange={(e) => execCommand('fontName', e.target.value)}
                        style={{ padding: '3px 6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '11px' }}
                      >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Courier New">Courier New</option>
                      </select>
                    </div>

                    <div style={toolbarGroupStyle}>
                      <select
                        onChange={(e) => execCommand('fontSize', e.target.value)}
                        style={{ padding: '3px 6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '11px' }}
                      >
                        <option value="1">8</option>
                        <option value="2">10</option>
                        <option value="3">12</option>
                        <option value="4">14</option>
                        <option value="5">18</option>
                        <option value="6">24</option>
                        <option value="7">36</option>
                      </select>
                    </div>

                    {/* Formatting Buttons */}
                    <div style={toolbarGroupStyle}>
                      <button onClick={() => execCommand('bold')} style={{...toolButtonStyle, fontWeight: 'bold', background: isBold ? '#e9ecef' : 'transparent', padding: '3px 8px', fontSize: '12px'}} title="Bold">B</button>
                      <button onClick={() => execCommand('italic')} style={{...toolButtonStyle, fontStyle: 'italic', background: isItalic ? '#e9ecef' : 'transparent', padding: '3px 8px', fontSize: '12px'}} title="Italic">I</button>
                      <button onClick={() => execCommand('underline')} style={{...toolButtonStyle, textDecoration: 'underline', background: isUnderline ? '#e9ecef' : 'transparent', padding: '3px 8px', fontSize: '12px'}} title="Underline">U</button>
                      <button onClick={() => execCommand('strikeThrough')} style={{...toolButtonStyle, textDecoration: 'line-through', padding: '3px 8px', fontSize: '12px'}} title="Strikethrough">S</button>
                      <button onClick={() => execCommand('removeFormat')} style={{...toolButtonStyle, color: '#dc3545', padding: '3px 8px', fontSize: '12px'}} title="Clear Formatting">✕</button>
                    </div>

                    {/* Text Color */}
                    <div style={toolbarGroupStyle}>
                      <input
                        type="color"
                        onChange={(e) => execCommand('foreColor', e.target.value)}
                        style={{ width: '20px', height: '20px', padding: '2px', cursor: 'pointer', border: '1px solid #ddd' }}
                        title="Text Color"
                      />
                      <input
                        type="color"
                        onChange={(e) => execCommand('hiliteColor', e.target.value)}
                        style={{ width: '20px', height: '20px', padding: '2px', cursor: 'pointer', border: '1px solid #ddd' }}
                        title="Highlight Color"
                      />
                    </div>

                    {/* Alignment */}
                    <div style={toolbarGroupStyle}>
                      <button onClick={() => execCommand('justifyLeft')} style={{...toolButtonStyle, background: alignment === 'left' ? '#e9ecef' : 'transparent', padding: '3px 8px', fontSize: '12px'}} title="Left">≡</button>
                      <button onClick={() => execCommand('justifyCenter')} style={{...toolButtonStyle, background: alignment === 'center' ? '#e9ecef' : 'transparent', padding: '3px 8px', fontSize: '12px'}} title="Center">☰</button>
                      <button onClick={() => execCommand('justifyRight')} style={{...toolButtonStyle, background: alignment === 'right' ? '#e9ecef' : 'transparent', padding: '3px 8px', fontSize: '12px'}} title="Right">≡</button>
                      <button onClick={() => execCommand('justifyFull')} style={{...toolButtonStyle, background: alignment === 'justify' ? '#e9ecef' : 'transparent', padding: '3px 8px', fontSize: '12px'}} title="Justify">☷</button>
                    </div>

                    {/* Lists */}
                    <div style={toolbarGroupStyle}>
                      <button onClick={() => execCommand('insertUnorderedList')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '12px'}} title="Bullet List">•</button>
                      <button onClick={() => execCommand('insertOrderedList')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '12px'}} title="Numbered List">1.</button>
                    </div>

                    {/* Indent */}
                    <div style={toolbarGroupStyle}>
                      <button onClick={() => execCommand('outdent')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '12px'}} title="Outdent">←</button>
                      <button onClick={() => execCommand('indent')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '12px'}} title="Indent">→</button>
                    </div>

                    {/* Insert */}
                    <div style={toolbarGroupStyle}>
                      <button onClick={() => execCommand('insertHorizontalRule')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '12px'}} title="HR">─</button>
                      <button onClick={() => {
                        const url = prompt('Enter URL:', 'http://');
                        if (url) execCommand('createLink', url);
                      }} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '12px'}} title="Link">🔗</button>
                      <button onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '12px'}} title="Image">🖼️</button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </div>

                    {/* Block Formatting */}
                    <div style={toolbarGroupStyle}>
                      <button onClick={() => execCommand('formatBlock', '<h1>')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '11px'}}>H1</button>
                      <button onClick={() => execCommand('formatBlock', '<h2>')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '11px'}}>H2</button>
                      <button onClick={() => execCommand('formatBlock', '<h3>')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '11px'}}>H3</button>
                      <button onClick={() => execCommand('formatBlock', '<p>')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '11px'}}>P</button>
                      <button onClick={() => execCommand('formatBlock', '<blockquote>')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '11px'}}>"</button>
                      <button onClick={() => execCommand('formatBlock', '<pre>')} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '11px'}}>{`</>`}</button>
                    </div>

                    {/* Undo/Redo */}
                    <div style={toolbarGroupStyle}>
                      <button onClick={undo} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '12px'}} title="Undo">↩</button>
                      <button onClick={redo} style={{...toolButtonStyle, padding: '3px 8px', fontSize: '12px'}} title="Redo">↪</button>
                    </div>

                    {/* Templates */}
                    <div style={toolbarGroupStyle}>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            insertTemplate(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        style={{ padding: '3px 6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '11px' }}
                      >
                        <option value="">Templates</option>
                        <option value="blog-intro">Blog Intro</option>
                        <option value="blog-conclusion">Conclusion</option>
                        <option value="call-to-action">Call to Action</option>
                        <option value="info-box">Info Box</option>
                        <option value="warning-box">Warning Box</option>
                        <option value="success-box">Success Box</option>
                        <option value="two-column">Two Column</option>
                      </select>
                    </div>

                    {/* Table */}
                    <div style={toolbarGroupStyle}>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const [rows, cols] = e.target.value.split('x').map(Number);
                            insertTable(rows, cols);
                            e.target.value = '';
                          }
                        }}
                        style={{ padding: '3px 6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '11px' }}
                      >
                        <option value="">Table</option>
                        <option value="2x2">2x2</option>
                        <option value="3x3">3x3</option>
                        <option value="3x4">3x4</option>
                        <option value="4x4">4x4</option>
                        <option value="5x3">5x3</option>
                      </select>
                    </div>

                    {/* Special Characters */}
                    <div style={toolbarGroupStyle}>
                      <button onClick={() => insertSpecialCharacter('©')} style={{...toolButtonStyle, padding: '3px 6px', fontSize: '12px'}}>©</button>
                      <button onClick={() => insertSpecialCharacter('®')} style={{...toolButtonStyle, padding: '3px 6px', fontSize: '12px'}}>®</button>
                      <button onClick={() => insertSpecialCharacter('™')} style={{...toolButtonStyle, padding: '3px 6px', fontSize: '12px'}}>™</button>
                      <button onClick={() => insertSpecialCharacter('•')} style={{...toolButtonStyle, padding: '3px 6px', fontSize: '12px'}}>•</button>
                      <button onClick={() => insertSpecialCharacter('✓')} style={{...toolButtonStyle, padding: '3px 6px', fontSize: '12px'}}>✓</button>
                      <button onClick={() => insertSpecialCharacter('★')} style={{...toolButtonStyle, padding: '3px 6px', fontSize: '12px'}}>★</button>
                    </div>

                    {/* Export */}
                    <div style={toolbarGroupStyle}>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            exportContent(e.target.value as 'html' | 'txt' | 'json');
                            e.target.value = '';
                          }
                        }}
                        style={{ padding: '3px 6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '11px' }}
                      >
                        <option value="">Export</option>
                        <option value="html">HTML</option>
                        <option value="txt">Text</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>

                    {/* Clean */}
                    <div style={toolbarGroupStyle}>
                      <button onClick={() => {
                        if (editorRef.current) {
                          const content = editorRef.current.innerHTML;
                          const cleaned = content
                            .replace(/<p>\s*<\/p>/g, '')
                            .replace(/<br\s*\/?>/g, '')
                            .trim();
                          setBlogData(prev => ({ ...prev, content: cleaned || '<p>Start typing...</p>' }));
                          if (editorRef.current) {
                            editorRef.current.innerHTML = cleaned || '<p>Start typing...</p>';
                          }
                        }
                      }} style={{...toolButtonStyle, color: '#dc3545', padding: '3px 8px', fontSize: '12px'}} title="Clean">🧹</button>
                    </div>
                  </div>

                  {/* Find and Replace Panel */}
                  {showFindReplace && (
                    <div style={{
                      padding: '6px 16px',
                      background: '#f8f9fa',
                      borderBottom: '1px solid #ddd',
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      flexShrink: 0,
                    }}>
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Find..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && findInText()}
                        style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', width: '120px' }}
                      />
                      {findCount > 0 && (
                        <span style={{ fontSize: '11px', color: '#666' }}>
                          {currentFindIndex + 1} of {findCount}
                        </span>
                      )}
                      <button onClick={findInText} style={{ padding: '3px 10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                        Find
                      </button>
                      <input
                        ref={replaceInputRef}
                        type="text"
                        placeholder="Replace..."
                        value={replaceTerm}
                        onChange={(e) => setReplaceTerm(e.target.value)}
                        style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', width: '120px' }}
                      />
                      <button onClick={replaceInText} style={{ padding: '3px 10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                        Replace
                      </button>
                      <button onClick={replaceAllInText} style={{ padding: '3px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                        All
                      </button>
                      <button onClick={() => setShowFindReplace(false)} style={{ padding: '3px 10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                        Close
                      </button>
                    </div>
                  )}

                  {/* Editor Area - contenteditable */}
                  <div
                    ref={editorContainerRef}
                    style={{
                      flex: 1,
                      overflow: 'auto',
                      position: 'relative',
                      background: '#fff',
                    }}
                  >
                    <div
                      ref={editorRef}
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onInput={handleContentChange}
                      style={{
                        minHeight: '100%',
                        padding: '20px',
                        background: '#fff',
                        outline: 'none',
                        fontSize: `${fontSize}px`,
                        fontFamily: fontFamily,
                        lineHeight: lineHeight,
                        color: selectedColor,
                        overflow: 'auto',
                      }}
                      dangerouslySetInnerHTML={{ __html: blogData.content }}
                    />
                  </div>

                  {/* Status Bar */}
                  <div style={{
                    padding: '4px 16px',
                    borderTop: '1px solid #ddd',
                    background: '#f8f9fa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11px',
                    color: '#666',
                    flexShrink: 0,
                    flexWrap: 'wrap',
                    gap: '4px',
                  }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>Words: {wordCount}</span>
                      <span>Chars: {charCount}</span>
                      <span>Reading: {blogData.readingTime} min</span>
                      {getPdfCount() > 0 && <span>📄 {getPdfCount()} PDFs</span>}
                      {getLinkCount() > 0 && <span>🔗 {getLinkCount()} Links</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          if (editorRef.current) {
                            const content = editorRef.current.innerHTML;
                            navigator.clipboard.writeText(content);
                            alert('HTML copied!');
                          }
                        }}
                        style={{
                          padding: '2px 10px',
                          background: '#17a2b8',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px',
                        }}
                      >
                        📋 HTML
                      </button>
                      <button
                        onClick={() => {
                          if (editorRef.current) {
                            const text = editorRef.current.innerText;
                            navigator.clipboard.writeText(text);
                            alert('Text copied!');
                          }
                        }}
                        style={{
                          padding: '2px 10px',
                          background: '#6c757d',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px',
                        }}
                      >
                        📋 Text
                      </button>
                      <button
                        onClick={printContent}
                        style={{
                          padding: '2px 10px',
                          background: '#ffc107',
                          color: '#333',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px',
                        }}
                      >
                        🖨️ Print
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Code View - Developer Friendly
                <div style={{ 
                  flex: 1,
                  padding: '16px',
                  overflow: 'auto',
                  background: '#1e1e2e',
                }}>
                  {/* Code Editor Toolbar */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '12px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}>
                    <span style={{ color: '#cdd6f4', fontSize: '12px', fontWeight: '500' }}>
                      💻 HTML Editor
                    </span>
                    <span style={{ color: '#a6adc8', fontSize: '11px' }}>
                      Line {codeContent.split('\n').length} | {codeContent.length} chars
                    </span>
                    <div style={{ flex: 1 }} />
                    <button
                      onClick={() => {
                        const formatted = codeContent
                          .replace(/>\s+</g, '><')
                          .replace(/\n\s*/g, '\n')
                          .trim();
                        setCodeContent(formatted);
                      }}
                      style={{
                        padding: '4px 12px',
                        background: '#45475a',
                        color: '#cdd6f4',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      🔧 Format
                    </button>
                    <button
                      onClick={applyCodeToDesign}
                      style={{
                        padding: '4px 12px',
                        background: '#a6e3a1',
                        color: '#1e1e2e',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      🔄 Apply to Design
                    </button>
                    <button
                      onClick={() => {
                        setCodeContent(blogData.content);
                      }}
                      style={{
                        padding: '4px 12px',
                        background: '#89b4fa',
                        color: '#1e1e2e',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      🔄 Sync
                    </button>
                  </div>

                  {/* Code Editor with Line Numbers */}
                  <div style={{
                    display: 'flex',
                    background: '#1e1e2e',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #313244',
                    height: 'calc(100% - 50px)',
                  }}>
                    {/* Line Numbers */}
                    <div style={{
                      padding: '12px 8px',
                      background: '#181825',
                      color: '#6c7086',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      lineHeight: '1.6',
                      overflow: 'hidden',
                      userSelect: 'none',
                      textAlign: 'right',
                      minWidth: '40px',
                      borderRight: '1px solid #313244',
                    }}>
                      {codeContent.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    {/* Code Textarea */}
                    <textarea
                      ref={codeEditorRef}
                      value={codeContent}
                      onChange={(e) => setCodeContent(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: '#1e1e2e',
                        color: '#cdd6f4',
                        border: 'none',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        resize: 'none',
                        outline: 'none',
                        tabSize: 2,
                      }}
                      placeholder="// Paste or type HTML code here..."
                      spellCheck={false}
                    />
                  </div>

                  {/* Code Tips */}
                  <div style={{
                    marginTop: '12px',
                    padding: '10px 12px',
                    background: '#313244',
                    borderRadius: '8px',
                    border: '1px solid #45475a',
                  }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ color: '#89b4fa', fontSize: '11px', fontWeight: 'bold' }}>Tips:</span>
                      </div>
                      <div>
                        <span style={{ color: '#a6adc8', fontSize: '10px' }}>
                          <code style={{ background: '#45475a', padding: '1px 6px', borderRadius: '3px', color: '#f9e2af' }}>&lt;h1&gt;</code> Headings
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#a6adc8', fontSize: '10px' }}>
                          <code style={{ background: '#45475a', padding: '1px 6px', borderRadius: '3px', color: '#f9e2af' }}>&lt;p&gt;</code> Paragraphs
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#a6adc8', fontSize: '10px' }}>
                          <code style={{ background: '#45475a', padding: '1px 6px', borderRadius: '3px', color: '#f9e2af' }}>&lt;img&gt;</code> Images
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#a6adc8', fontSize: '10px' }}>
                          <code style={{ background: '#45475a', padding: '1px 6px', borderRadius: '3px', color: '#f9e2af' }}>&lt;ul&gt;</code> Lists
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#a6adc8', fontSize: '10px' }}>
                          <code style={{ background: '#45475a', padding: '1px 6px', borderRadius: '3px', color: '#f9e2af' }}>&lt;blockquote&gt;</code> Quotes
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#a6adc8', fontSize: '10px' }}>
                          <code style={{ background: '#45475a', padding: '1px 6px', borderRadius: '3px', color: '#f9e2af' }}>&lt;table&gt;</code> Tables
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showPdfModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h3 style={{ marginBottom: '16px' }}>Add PDF Resource</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Title *</label>
              <input
                type="text"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="PDF title"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Upload PDF</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPdfFile(file);
                }}
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>or URL</label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://example.com/document.pdf"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPdfModal(false)}
                style={{
                  padding: '8px 20px',
                  background: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={addPdf}
                style={{
                  padding: '8px 20px',
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Add PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
          }}>
            <h3 style={{ marginBottom: '16px' }}>Add Useful Link</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Title *</label>
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Link title"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>URL *</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLinkModal(false)}
                style={{
                  padding: '8px 20px',
                  background: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={addLink}
                style={{
                  padding: '8px 20px',
                  background: '#17a2b8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCreator;