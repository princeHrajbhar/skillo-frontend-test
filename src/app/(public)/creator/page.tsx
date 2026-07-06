"use client"
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { NextPage } from 'next';

// ============================================
// TYPES
// ============================================
interface EditorMetadata {
  wordCount: number;
  charCount: number;
  readingTime: number;
  updatedAt: string;
}

interface HistoryState {
  content: string;
  timestamp: number;
}

interface ExportData {
  blogBody: string;
  html: string;
  css: string;
  js: string;
  metadata: EditorMetadata;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
const calculateStats = (content: string) => {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\\s+/).filter(w => w);
  const wordCount = words.length;
  const charCount = text.length;
  const readingTime = Math.ceil(wordCount / 200);
  return { wordCount, charCount, readingTime };
};

const generateFullHTML = (content: string, metadata: EditorMetadata) => {
  const css = `
    .blog-content { max-width: 900px; margin: 0 auto; padding: 40px 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.8; color: #333; direction: ltr; text-align: left; }
    .blog-content * { direction: ltr; text-align: left; }
    .blog-content h1 { font-size: 40px; font-weight: 700; margin-bottom: 0.5em; color: #1a1a1a; }
    .blog-content h2 { font-size: 28px; margin: 1.5em 0 0.5em; color: #2c3e50; }
    .blog-content h3 { font-size: 22px; margin: 1.2em 0 0.5em; color: #34495e; }
    .blog-content p { margin-bottom: 1em; }
    .blog-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
    .blog-content blockquote { border-left: 4px solid #3498db; padding: 15px 20px; margin: 20px 0; background: #f8f9fa; }
    .blog-content pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    .blog-content ul, .blog-content ol { margin: 15px 0 15px 25px; }
    .blog-content table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .blog-content th, .blog-content td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    .blog-content th { background: #f4f4f4; }
  `;
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Blog Post</title><style>${css}</style></head>
<body style="direction:ltr;text-align:left;"><article class="blog-content">
<div class="blog-body">${content}</div>
<footer><p>📊 ${metadata.wordCount} words • ${metadata.charCount} characters • ${metadata.readingTime} min read</p></footer>
</article></body></html>`;
};

/**
 * Save current cursor position in contentEditable
 */
const saveSelection = (containerEl: HTMLElement) => {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(containerEl);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  return preCaretRange.toString().length;
};

/**
 * Restore cursor position in contentEditable
 */
const restoreSelection = (containerEl: HTMLElement, offset: number) => {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  let charCount = 0;
  let found = false;

  const traverse = (node: Node) => {
    if (found) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharCount = charCount + (node.textContent?.length || 0);
      if (offset <= nextCharCount) {
        range.setStart(node, offset - charCount);
        range.setEnd(node, offset - charCount);
        found = true;
        return;
      }
      charCount = nextCharCount;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i]);
        if (found) return;
      }
    }
  };

  traverse(containerEl);
  if (!found) {
    const lastChild = containerEl.lastChild;
    if (lastChild) {
      range.selectNodeContents(lastChild);
      range.collapse(false);
    } else {
      range.selectNodeContents(containerEl);
      range.collapse(false);
    }
  }
  sel.removeAllRanges();
  sel.addRange(range);
};

// ============================================
// TOOLBAR COMPONENT
// ============================================
interface ToolbarProps {
  onAction: (command: string, value?: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleView: () => void;
  onExport: (format: 'html' | 'json' | 'txt') => void;
  onPrint: () => void;
  onImageUpload: () => void;
  onInsertTable: () => void;
  onInsertSpecialChar: (char: string) => void;
  onInsertTemplate: (type: string) => void;
  onToggleFullscreen: () => void;
  viewMode: 'design' | 'code';
  canUndo: boolean;
  canRedo: boolean;
  readOnly?: boolean;
  wordCount: number;
  isFullscreen: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAction,
  onUndo,
  onRedo,
  onToggleView,
  onExport,
  onPrint,
  onImageUpload,
  onInsertTable,
  onInsertSpecialChar,
  onInsertTemplate,
  onToggleFullscreen,
  viewMode,
  canUndo,
  canRedo,
  readOnly = false,
  wordCount,
  isFullscreen,
}) => {
  const [showSpecialChars, setShowSpecialChars] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const fontFamilies = ['Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New', 'Segoe UI', 'Tahoma', 'Trebuchet MS'];
  const fontSizes = [
    { label: '8px', value: '1' }, { label: '10px', value: '2' },
    { label: '12px', value: '3' }, { label: '14px', value: '4' },
    { label: '18px', value: '5' }, { label: '24px', value: '6' },
    { label: '36px', value: '7' },
  ];
  const specialChars = [
    '©', '®', '™', '•', '✓', '★', '☆', '♥', '♦', '♠', '♣',
    '→', '←', '↑', '↓', '↔', '✗', '✘', '✔', '✖',
    '∑', '∫', '∞', '√', '≈', '≠', '≤', '≥', '±', '÷',
    '«', '»', '\\u201C', '\\u201D', '\\u2018', '\\u2019', '…', '—', '–', '¦'
  ];
  const templates = [
    { id: 'blog-intro', label: 'Blog Intro', html: '<p style="font-size:18px;color:#2c3e50;font-weight:500;">Welcome to this comprehensive guide where we explore the topic in depth.</p>' },
    { id: 'blog-conclusion', label: 'Conclusion', html: '<div style="background:#f8f9fa;padding:20px;border-radius:8px;border-left:4px solid #3498db;"><p style="margin:0;font-size:16px;"><strong>Key Takeaways:</strong></p><ul><li>Key point 1</li><li>Key point 2</li><li>Key point 3</li></ul></div>' },
    { id: 'call-to-action', label: 'Call to Action', html: '<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;border-radius:8px;text-align:center;color:white;"><h3 style="color:white;margin:0 0 10px;">Ready to Learn More?</h3><p style="margin:0 0 15px;">Join our community of learners today!</p><button style="background:white;color:#764ba2;border:none;padding:10px 30px;border-radius:25px;cursor:pointer;font-weight:bold;">Get Started</button></div>' },
    { id: 'info-box', label: 'Info Box', html: '<div style="background:#e3f2fd;padding:15px 20px;border-radius:8px;border-left:4px solid #2196f3;margin:10px 0;"><p style="margin:0;color:#1565c0;"><strong>📝 Note:</strong> Add your important information here.</p></div>' },
    { id: 'warning-box', label: 'Warning Box', html: '<div style="background:#fff3e0;padding:15px 20px;border-radius:8px;border-left:4px solid #ff9800;margin:10px 0;"><p style="margin:0;color:#e65100;"><strong>⚠️ Warning:</strong> Important notice or warning message.</p></div>' },
    { id: 'success-box', label: 'Success Box', html: '<div style="background:#e8f5e9;padding:15px 20px;border-radius:8px;border-left:4px solid #4caf50;margin:10px 0;"><p style="margin:0;color:#2e7d32;"><strong>✅ Success:</strong> Congratulations on your achievement!</p></div>' },
    { id: 'two-column', label: 'Two Columns', html: '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:15px 0;"><div style="background:#f5f5f5;padding:15px;border-radius:8px;"><h4>Column 1</h4><p>Content for column 1</p></div><div style="background:#f5f5f5;padding:15px;border-radius:8px;"><h4>Column 2</h4><p>Content for column 2</p></div></div>' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200" style={{ direction: 'ltr' }}>
      <button onClick={onToggleView} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
        {viewMode === 'design' ? '💻 Code' : '🎨 Design'}
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      {viewMode === 'design' && !readOnly && (
        <>
          <button onClick={onUndo} disabled={!canUndo} className="px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Undo (Ctrl+Z)">↩️</button>
          <button onClick={onRedo} disabled={!canRedo} className="px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Redo (Ctrl+Shift+Z)">↪️</button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <select onChange={(e) => onAction('fontName', e.target.value)} className="px-1 py-1 text-sm border border-gray-300 rounded-md bg-white" style={{ direction: 'ltr' }}>
            {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
          </select>
          <select onChange={(e) => onAction('fontSize', e.target.value)} className="px-1 py-1 text-sm border border-gray-300 rounded-md bg-white" style={{ direction: 'ltr' }}>
            {fontSizes.map(size => <option key={size.value} value={size.value}>{size.label}</option>)}
          </select>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button onClick={() => onAction('bold')} className="px-2 py-1 text-sm rounded hover:bg-gray-200 font-bold" title="Bold (Ctrl+B)">B</button>
          <button onClick={() => onAction('italic')} className="px-2 py-1 text-sm rounded hover:bg-gray-200 italic" title="Italic (Ctrl+I)">I</button>
          <button onClick={() => onAction('underline')} className="px-2 py-1 text-sm rounded hover:bg-gray-200 underline" title="Underline (Ctrl+U)">U</button>
          <button onClick={() => onAction('strikeThrough')} className="px-2 py-1 text-sm rounded hover:bg-gray-200 line-through" title="Strikethrough">S</button>
          <button onClick={() => onAction('removeFormat')} className="px-2 py-1 text-sm rounded hover:bg-gray-200 text-red-500" title="Clear Formatting">✕</button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <input type="color" onChange={(e) => onAction('foreColor', e.target.value)} className="w-6 h-6 p-0 border border-gray-300 rounded cursor-pointer" title="Text Color" />
          <input type="color" onChange={(e) => onAction('hiliteColor', e.target.value)} className="w-6 h-6 p-0 border border-gray-300 rounded cursor-pointer" title="Highlight Color" />
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button onClick={() => onAction('justifyLeft')} className="px-1 py-1 text-sm rounded hover:bg-gray-200" title="Align Left">≡</button>
          <button onClick={() => onAction('justifyCenter')} className="px-1 py-1 text-sm rounded hover:bg-gray-200" title="Align Center">☰</button>
          <button onClick={() => onAction('justifyRight')} className="px-1 py-1 text-sm rounded hover:bg-gray-200" title="Align Right">≡</button>
          <button onClick={() => onAction('justifyFull')} className="px-1 py-1 text-sm rounded hover:bg-gray-200" title="Justify">☷</button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button onClick={() => onAction('insertUnorderedList')} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Bullet List">•</button>
          <button onClick={() => onAction('insertOrderedList')} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Numbered List">1.</button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button onClick={() => onAction('outdent')} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Outdent">←</button>
          <button onClick={() => onAction('indent')} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Indent">→</button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button onClick={() => onAction('formatBlock', '<h1>')} className="px-2 py-1 text-sm rounded hover:bg-gray-200 font-bold">H1</button>
          <button onClick={() => onAction('formatBlock', '<h2>')} className="px-2 py-1 text-sm rounded hover:bg-gray-200 font-bold">H2</button>
          <button onClick={() => onAction('formatBlock', '<h3>')} className="px-2 py-1 text-sm rounded hover:bg-gray-200 font-bold">H3</button>
          <button onClick={() => onAction('formatBlock', '<h4>')} className="px-2 py-1 text-sm rounded hover:bg-gray-200 font-bold">H4</button>
          <button onClick={() => onAction('formatBlock', '<p>')} className="px-2 py-1 text-sm rounded hover:bg-gray-200">P</button>
          <button onClick={() => onAction('formatBlock', '<blockquote>')} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Quote">"</button>
          <button onClick={() => onAction('formatBlock', '<pre>')} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Code Block">{`</>`}</button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button onClick={() => onAction('insertHorizontalRule')} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Horizontal Line">─</button>
          <button onClick={() => { const url = prompt('Enter URL:'); if (url) onAction('createLink', url); }} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Insert Link">🔗</button>
          <button onClick={onImageUpload} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Insert Image">🖼️</button>
          <button onClick={onInsertTable} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Insert Table">📊</button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <div className="relative">
            <button onClick={() => setShowSpecialChars(!showSpecialChars)} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Special Characters">Ω</button>
            {showSpecialChars && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 grid grid-cols-5 gap-1 w-64" style={{ direction: 'ltr' }}>
                {specialChars.map(char => <button key={char} onClick={() => { onInsertSpecialChar(char); setShowSpecialChars(false); }} className="p-1 hover:bg-gray-100 rounded text-sm">{char}</button>)}
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => setShowTemplates(!showTemplates)} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Templates">📋</button>
            {showTemplates && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[150px]" style={{ direction: 'ltr' }}>
                {templates.map(template => <button key={template.id} onClick={() => { onInsertTemplate(template.id); setShowTemplates(false); }} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm">{template.label}</button>)}
              </div>
            )}
          </div>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button onClick={onToggleFullscreen} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Fullscreen">⛶</button>
        </>
      )}
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <select onChange={(e) => { if (e.target.value) { onExport(e.target.value as 'html' | 'json' | 'txt'); e.target.value = ''; } }} className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white" style={{ direction: 'ltr' }}>
        <option value="">Export</option><option value="html">HTML</option><option value="json">JSON</option><option value="txt">Text</option>
      </select>
      <button onClick={onPrint} className="px-2 py-1 text-sm rounded hover:bg-gray-200" title="Print">🖨️</button>
      <div className="ml-auto text-sm text-gray-500">📝 {wordCount} words</div>
    </div>
  );
};

// ============================================
// MAIN EDITOR COMPONENT
// ============================================
interface DesignEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onStatisticsUpdate?: (stats: { wordCount: number; charCount: number; readingTime: number }) => void;
  onExport?: (data: ExportData) => void;
  readOnly?: boolean;
}

const DesignEditor: React.FC<DesignEditorProps> = ({
  initialContent = '<p>Start typing here...</p>',
  onContentChange,
  onStatisticsUpdate,
  onExport,
  readOnly = false,
}) => {
  const [content, setContent] = useState(initialContent);
  const [codeContent, setCodeContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState<'design' | 'code'>('design');
  const [history, setHistory] = useState<HistoryState[]>([{ content: initialContent, timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [metadata, setMetadata] = useState<EditorMetadata>({ wordCount: 0, charCount: 0, readingTime: 0, updatedAt: new Date().toISOString() });
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUpdatingFromCode = useRef(false);
  const isUpdatingFromDesign = useRef(false);
  const cursorOffsetRef = useRef(0);
  const skipNextUpdate = useRef(false);

  // Update statistics
  const updateStatistics = useCallback((htmlContent: string) => {
    const stats = calculateStats(htmlContent);
    setMetadata(prev => ({ ...prev, wordCount: stats.wordCount, charCount: stats.charCount, readingTime: stats.readingTime, updatedAt: new Date().toISOString() }));
    if (onStatisticsUpdate) onStatisticsUpdate(stats);
  }, [onStatisticsUpdate]);

  // Update history
  const updateHistory = useCallback((newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ content: newContent, timestamp: Date.now() });
    if (newHistory.length > 100) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Handle content change - CRITICAL: preserve cursor
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setCodeContent(newContent);
    updateStatistics(newContent);
    updateHistory(newContent);
    if (onContentChange) onContentChange(newContent);
  }, [updateStatistics, updateHistory, onContentChange]);

  // Design editor change - save cursor BEFORE reading content
  const handleDesignChange = useCallback(() => {
    if (!editorRef.current || isUpdatingFromCode.current) return;
    
    // Save cursor position BEFORE reading innerHTML
    const offset = saveSelection(editorRef.current);
    if (offset !== null) cursorOffsetRef.current = offset;
    
    isUpdatingFromDesign.current = true;
    const newContent = editorRef.current.innerHTML;
    handleContentChange(newContent);
    isUpdatingFromDesign.current = false;
  }, [handleContentChange]);

  // Code editor change
  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isUpdatingFromDesign.current) return;
    isUpdatingFromCode.current = true;
    const newContent = e.target.value;
    setCodeContent(newContent);
    handleContentChange(newContent);
    isUpdatingFromCode.current = false;
  }, [handleContentChange]);

  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    const newMode = viewMode === 'design' ? 'code' : 'design';
    if (newMode === 'code') {
      setCodeContent(content);
    } else {
      skipNextUpdate.current = true;
      setContent(codeContent);
      updateStatistics(codeContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = codeContent;
      }
    }
    setViewMode(newMode);
  }, [viewMode, content, codeContent, updateStatistics]);

  // Execute formatting command
  const execCommand = useCallback((command: string, value?: string) => {
    if (readOnly || viewMode !== 'design') return;
    
    // Save cursor before command
    if (editorRef.current) {
      const offset = saveSelection(editorRef.current);
      if (offset !== null) cursorOffsetRef.current = offset;
    }
    
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleDesignChange();
  }, [readOnly, viewMode, handleDesignChange]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const newContent = history[newIndex].content;
      skipNextUpdate.current = true;
      setContent(newContent);
      setCodeContent(newContent);
      updateStatistics(newContent);
      if (editorRef.current) editorRef.current.innerHTML = newContent;
      if (onContentChange) onContentChange(newContent);
    }
  }, [history, historyIndex, updateStatistics, onContentChange]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const newContent = history[newIndex].content;
      skipNextUpdate.current = true;
      setContent(newContent);
      setCodeContent(newContent);
      updateStatistics(newContent);
      if (editorRef.current) editorRef.current.innerHTML = newContent;
      if (onContentChange) onContentChange(newContent);
    }
  }, [history, historyIndex, updateStatistics, onContentChange]);

  // Export
  const handleExport = useCallback((format: 'html' | 'json' | 'txt') => {
    const textContent = content.replace(/<[^>]*>/g, "");
    switch(format) {
      case 'html': navigator.clipboard.writeText(generateFullHTML(content, metadata)); alert('✅ HTML copied to clipboard!'); break;
      case 'json':
        const exportData: ExportData = { blogBody: content, html: generateFullHTML(content, metadata), css: '', js: '', metadata };
        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
        alert('✅ JSON copied to clipboard!');
        if (onExport) onExport(exportData);
        break;
      case 'txt': navigator.clipboard.writeText(textContent); alert('✅ Text copied to clipboard!'); break;
    }
  }, [content, metadata, onExport]);

  // Print
  const handlePrint = useCallback(() => {
    const html = generateFullHTML(content, metadata);
    const printWindow = window.open('', '_blank');
    if (printWindow) { printWindow.document.write(html); printWindow.document.close(); printWindow.print(); }
  }, [content, metadata]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) { containerRef.current.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Image Upload
  const triggerImageUpload = useCallback(() => fileInputRef.current?.click(), []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageLoading(true);
    if (file.size > 5 * 1024 * 1024) { alert('⚠️ Image size should be less than 5MB'); setImageLoading(false); return; }
    if (!file.type.startsWith('image/')) { alert('⚠️ Please upload an image file'); setImageLoading(false); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      const imageHtml = `<div style="margin:10px 0;position:relative;"><img src="${imageUrl}" alt="${file.name}" style="max-width:100%;height:auto;border-radius:8px;display:block;" class="editor-image"/><div style="margin-top:4px;font-size:12px;color:#6b7280;text-align:center;">${file.name} (${(file.size/1024).toFixed(1)} KB)</div></div>`;
      document.execCommand('insertHTML', false, imageHtml);
      editorRef.current?.focus();
      handleDesignChange();
      setImageLoading(false);
    };
    reader.onerror = () => { alert('⚠️ Error reading image file'); setImageLoading(false); };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [handleDesignChange]);

  // Insert Table
  const insertTable = useCallback(() => {
    const rows = prompt('Enter number of rows:', '3') || '3';
    const cols = prompt('Enter number of columns:', '3') || '3';
    const numRows = parseInt(rows), numCols = parseInt(cols);
    if (isNaN(numRows) || isNaN(numCols) || numRows < 1 || numCols < 1) { alert('Please enter valid numbers'); return; }
    let tableHtml = '<table style="width:100%;border-collapse:collapse;margin:10px 0;">';
    for (let i = 0; i < numRows; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < numCols; j++) {
        tableHtml += i === 0 ? `<th style="border:1px solid #ddd;padding:8px;background:#f4f4f4;text-align:left;">Header ${j+1}</th>` : `<td style="border:1px solid #ddd;padding:8px;text-align:left;">Cell ${i+1}${j+1}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    document.execCommand('insertHTML', false, tableHtml);
    editorRef.current?.focus();
    handleDesignChange();
  }, [handleDesignChange]);

  // Insert Special Character
  const insertSpecialChar = useCallback((char: string) => {
    document.execCommand('insertText', false, char);
    editorRef.current?.focus();
    handleDesignChange();
  }, [handleDesignChange]);

  // Insert Template
  const insertTemplate = useCallback((type: string) => {
    const templates: Record<string, string> = {
      'blog-intro': '<p style="font-size:18px;color:#2c3e50;font-weight:500;">Welcome to this comprehensive guide where we explore the topic in depth.</p>',
      'blog-conclusion': '<div style="background:#f8f9fa;padding:20px;border-radius:8px;border-left:4px solid #3498db;"><p style="margin:0;font-size:16px;"><strong>Key Takeaways:</strong></p><ul><li>Key point 1</li><li>Key point 2</li><li>Key point 3</li></ul></div>',
      'call-to-action': '<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;border-radius:8px;text-align:center;color:white;"><h3 style="color:white;margin:0 0 10px;">Ready to Learn More?</h3><p style="margin:0 0 15px;">Join our community of learners today!</p><button style="background:white;color:#764ba2;border:none;padding:10px 30px;border-radius:25px;cursor:pointer;font-weight:bold;">Get Started</button></div>',
      'info-box': '<div style="background:#e3f2fd;padding:15px 20px;border-radius:8px;border-left:4px solid #2196f3;margin:10px 0;"><p style="margin:0;color:#1565c0;"><strong>📝 Note:</strong> Add your important information here.</p></div>',
      'warning-box': '<div style="background:#fff3e0;padding:15px 20px;border-radius:8px;border-left:4px solid #ff9800;margin:10px 0;"><p style="margin:0;color:#e65100;"><strong>⚠️ Warning:</strong> Important notice or warning message.</p></div>',
      'success-box': '<div style="background:#e8f5e9;padding:15px 20px;border-radius:8px;border-left:4px solid #4caf50;margin:10px 0;"><p style="margin:0;color:#2e7d32;"><strong>✅ Success:</strong> Congratulations on your achievement!</p></div>',
      'two-column': '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:15px 0;"><div style="background:#f5f5f5;padding:15px;border-radius:8px;"><h4>Column 1</h4><p>Content for column 1</p></div><div style="background:#f5f5f5;padding:15px;border-radius:8px;"><h4>Column 2</h4><p>Content for column 2</p></div></div>',
    };
    const templateHtml = templates[type];
    if (templateHtml) {
      document.execCommand('insertHTML', false, templateHtml);
      editorRef.current?.focus();
      handleDesignChange();
    }
  }, [handleDesignChange]);

  // Drag and drop support
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (viewMode !== 'design' || readOnly) return;
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
          handleImageUpload(fakeEvent);
        }
      }
    };
    const editor = document.getElementById('editor-container');
    if (editor) { editor.addEventListener('dragover', handleDragOver); editor.addEventListener('drop', handleDrop); }
    return () => {
      if (editor) { editor.removeEventListener('dragover', handleDragOver); editor.removeEventListener('drop', handleDrop); }
    };
  }, [viewMode, readOnly, handleImageUpload]);

  // Find and Replace
  const findInText = useCallback(() => {
    if (!searchTerm || !editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const regex = new RegExp(searchTerm, 'gi');
    if (regex.test(html)) {
      const highlighted = html.replace(regex, (match) => `<span style="background: #ffff00; padding: 0 2px;">${match}</span>`);
      editorRef.current.innerHTML = highlighted;
      handleContentChange(highlighted);
    }
  }, [searchTerm, handleContentChange]);

  const replaceInText = useCallback(() => {
    if (!searchTerm || !replaceTerm || !editorRef.current) return;
    const html = editorRef.current.innerHTML.replace(new RegExp(searchTerm, 'gi'), replaceTerm);
    editorRef.current.innerHTML = html;
    handleContentChange(html);
  }, [searchTerm, replaceTerm, handleContentChange]);

  const replaceAllInText = useCallback(() => {
    if (!searchTerm || !replaceTerm || !editorRef.current) return;
    const html = editorRef.current.innerHTML.replace(new RegExp(searchTerm, 'g'), replaceTerm);
    editorRef.current.innerHTML = html;
    handleContentChange(html);
  }, [searchTerm, replaceTerm, handleContentChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); setShowFindReplace(true); }
      if (e.key === 'Escape') setShowFindReplace(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // CRITICAL: Initialize editor content ONCE on mount, never use dangerouslySetInnerHTML
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
    updateStatistics(initialContent);
  }, []);

  // CRITICAL: Restore cursor after content updates from external sources only
  useEffect(() => {
    if (skipNextUpdate.current) {
      skipNextUpdate.current = false;
      return;
    }
    if (editorRef.current && viewMode === 'design' && !isUpdatingFromDesign.current) {
      // Only restore if we have a valid offset and the content actually changed from external
      if (cursorOffsetRef.current > 0) {
        requestAnimationFrame(() => {
          if (editorRef.current) {
            restoreSelection(editorRef.current, cursorOffsetRef.current);
          }
        });
      }
    }
  }, [content, viewMode]);

  return (
    <div ref={containerRef} id="editor-container" className="flex flex-col h-full min-h-[500px] border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden" style={{ direction: 'ltr' }}>
      <Toolbar
        onAction={execCommand} onUndo={undo} onRedo={redo} onToggleView={toggleViewMode}
        onExport={handleExport} onPrint={handlePrint} onImageUpload={triggerImageUpload}
        onInsertTable={insertTable} onInsertSpecialChar={insertSpecialChar}
        onInsertTemplate={insertTemplate} onToggleFullscreen={toggleFullscreen}
        viewMode={viewMode} canUndo={historyIndex > 0} canRedo={historyIndex < history.length - 1}
        readOnly={readOnly} wordCount={metadata.wordCount} isFullscreen={isFullscreen}
      />

      {showFindReplace && viewMode === 'design' && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border-b border-gray-200" style={{ direction: 'ltr' }}>
          <input type="text" placeholder="Find..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ direction: 'ltr' }} />
          <button onClick={findInText} className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">Find</button>
          <input type="text" placeholder="Replace..." value={replaceTerm} onChange={(e) => setReplaceTerm(e.target.value)} className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ direction: 'ltr' }} />
          <button onClick={replaceInText} className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">Replace</button>
          <button onClick={replaceAllInText} className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">All</button>
          <button onClick={() => setShowFindReplace(false)} className="px-3 py-1 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700">Close</button>
        </div>
      )}

      {imageLoading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Uploading image...</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto bg-white">
        {viewMode === 'design' ? (
          <div
            ref={editorRef}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={handleDesignChange}
            className="min-h-full p-6 outline-none prose prose-sm sm:prose lg:prose-lg max-w-none"
            style={{
              cursor: readOnly ? 'default' : 'text',
              minHeight: '300px',
              direction: 'ltr',
              textAlign: 'left',
              unicodeBidi: 'normal'
            }}
            // NO dangerouslySetInnerHTML - content set via useEffect once
          />
        ) : (
          <div className="flex h-full bg-gray-900" style={{ direction: 'ltr' }}>
            <div className="px-2 py-3 font-mono text-xs text-gray-500 bg-gray-800 select-none text-right min-w-[40px] border-r border-gray-700">
              {codeContent.split('\\n').map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
              value={codeContent}
              onChange={handleCodeChange}
              className="flex-1 p-3 font-mono text-sm text-gray-200 bg-gray-900 resize-none outline-none"
              style={{ tabSize: 2, direction: 'ltr', textAlign: 'left', unicodeBidi: 'plaintext' }}
              spellCheck={false}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200" style={{ direction: 'ltr' }}>
        <div className="flex gap-4">
          <span>Mode: {viewMode === 'design' ? '🎨 Design' : '💻 Code'}</span>
          <span>Words: {metadata.wordCount}</span>
          <span>Chars: {metadata.charCount}</span>
          <span>Reading: {metadata.readingTime} min</span>
          <span>Versions: {history.length}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { const text = content.replace(/<[^>]*>/g, ""); navigator.clipboard.writeText(text); alert('✅ Text copied!'); }} className="px-2 py-0.5 text-xs bg-gray-200 rounded hover:bg-gray-300">📋 Copy Text</button>
          <button onClick={triggerImageUpload} className="px-2 py-0.5 text-xs bg-gray-200 rounded hover:bg-gray-300">🖼️ Upload Image</button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" multiple={false} />
        </div>
      </div>
    </div>
  );
};

// ============================================
// NEXT.JS PAGE
// ============================================
const EditorPage: NextPage = () => {
  const [content, setContent] = useState('<p style="direction:ltr;text-align:left;">Welcome to my blog! Start writing here...</p>');
  const [stats, setStats] = useState({ wordCount: 0, charCount: 0, readingTime: 0 });

  const handleExport = (data: ExportData) => console.log('📦 Export Data:', data);

  return (
    <div className="min-h-screen p-4 bg-gray-100" style={{ direction: 'ltr' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">📝 CMS Editor</h1>
          <button onClick={() => { const json = JSON.stringify({ content, stats }, null, 2); console.log('📄 Save Data:', json); alert('✅ Saved to console!'); }} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">💾 Save</button>
        </div>
        <div className="h-[70vh]">
          <DesignEditor
            initialContent={content}
            onContentChange={(newContent) => setContent(newContent)}
            onStatisticsUpdate={(newStats) => setStats(newStats)}
            onExport={handleExport}
          />
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm" style={{ direction: 'ltr' }}>
          <h2 className="text-lg font-semibold mb-2">📄 Live Preview</h2>
          <div className="prose max-w-none" style={{ direction: 'ltr', textAlign: 'left' }}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <span className="mr-4">Words: {stats.wordCount}</span>
            <span className="mr-4">Characters: {stats.charCount}</span>
            <span>Reading Time: {stats.readingTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
