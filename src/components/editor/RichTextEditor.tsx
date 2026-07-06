"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- CKEditor's classic build
   ships no usable TS types for the create()/model/conversion APIs we call, so
   the editor instance and its fragments are intentionally typed as `any`. */

/**
 * RichTextEditor
 * -------------------------------------------------------------------------
 * Visual (WYSIWYG) CMS editor built on CKEditor 5 (classic build), ported and
 * adapted for Skillo. Used for blog content and course CMS content.
 *
 * Features:
 *  - Headings, bold/italic, links, ordered/unordered lists, indent/outdent
 *  - Block quotes, tables, media embed (YouTube/iframe previews in data)
 *  - Subscript / superscript
 *  - Image insert via file upload (Skillo /files API) or by URL
 *  - Source-code mode to edit / paste raw HTML (iframes, embeds, etc.)
 *
 * The CKEditor build is imported dynamically inside an effect so it never runs
 * during SSR / static generation (it touches window/document).
 */

import { useEffect, useRef, useState } from "react";
import { FiCode, FiImage, FiUpload, FiLink, FiX } from "react-icons/fi";

interface RichTextEditorProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

// Resolve the backend base URL the same way services/baseApi.ts does.
const resolveApiBaseUrl = (): string => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1")
    .trim()
    .replace(/\/+$/, "");
  return raw.endsWith("/api/v1") ? raw : `${raw}/api/v1`;
};

const checkForRawHtml = (html: string) =>
  /<(iframe|video|embed|object|figure\s+class="media"|audio)/i.test(html);

const formatHtml = (html: string): string => {
  let formatted = "";
  let indent = 0;
  const tab = "  ";
  const tokens = html.replace(/></g, ">\n<").split("\n");

  tokens.forEach((token) => {
    const trimmed = token.trim();
    if (!trimmed) return;
    const isClosing = /^<\//.test(trimmed);
    const isSelfClosing =
      /\/>$/.test(trimmed) || /^<(br|hr|img|input|meta|link)\b/i.test(trimmed);
    const isOpening = /^<[^/]/.test(trimmed) && !isSelfClosing;
    const isInline = /^<\w[^>]*>[^<]*<\/\w+>$/.test(trimmed);

    if (isInline || isSelfClosing) {
      formatted += tab.repeat(indent) + trimmed + "\n";
    } else if (isClosing) {
      indent = Math.max(0, indent - 1);
      formatted += tab.repeat(indent) + trimmed + "\n";
    } else if (isOpening) {
      formatted += tab.repeat(indent) + trimmed + "\n";
      indent++;
    } else {
      formatted += tab.repeat(indent) + trimmed + "\n";
    }
  });
  return formatted.trim();
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const isInitializingRef = useRef(false);
  const suppressOnChangeRef = useRef(false);
  const rawContentRef = useRef<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If the incoming content contains raw embeds, open in source mode first.
  const startsRaw = !!(value && checkForRawHtml(value));
  const [isSourceMode, setIsSourceMode] = useState(startsRaw);
  const [sourceCode, setSourceCode] = useState(() =>
    startsRaw ? formatHtml(value) : "",
  );
  const [isReady, setIsReady] = useState(false);

  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Initialise / tear down the CKEditor instance whenever we toggle modes.
  useEffect(() => {
    let cancelled = false;

    const initEditor = async () => {
      if (isSourceMode || isInitializingRef.current || editorInstanceRef.current) {
        return;
      }
      isInitializingRef.current = true;

      try {
        const mod: any = await import("@ckeditor/ckeditor5-build-classic");
        const ClassicEditor = mod.default;

        if (cancelled || !editorContainerRef.current || editorInstanceRef.current) {
          isInitializingRef.current = false;
          return;
        }

        const editor = await ClassicEditor.create(editorContainerRef.current, {
          placeholder: placeholder || "Write your content here...",
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "indent",
              "outdent",
              "|",
              "blockQuote",
              "insertTable",
              "mediaEmbed",
              "|",
              "undo",
              "redo",
            ],
          },
          heading: {
            options: [
              { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
              { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
              { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
              { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
              { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
            ],
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          mediaEmbed: { previewsInData: true },
        });

        // Allow <sub>/<sup> round-tripping.
        editor.model.schema.extend("$text", {
          allowAttributes: ["subscript", "superscript"],
        });
        editor.conversion.for("upcast").elementToAttribute({
          view: "sub",
          model: "subscript",
          converterPriority: "high",
        });
        editor.conversion.for("downcast").attributeToElement({
          model: "subscript",
          view: "sub",
          converterPriority: "high",
        });
        editor.conversion.for("upcast").elementToAttribute({
          view: "sup",
          model: "superscript",
          converterPriority: "high",
        });
        editor.conversion.for("downcast").attributeToElement({
          model: "superscript",
          view: "sup",
          converterPriority: "high",
        });

        const editableEl = editor.ui.view.editable.element;
        if (editableEl) {
          editableEl.style.maxHeight = "600px";
          editableEl.style.overflowY = "auto";
        }

        editorInstanceRef.current = editor;
        setIsReady(true);
        isInitializingRef.current = false;

        if (value && !isSourceMode) {
          suppressOnChangeRef.current = true;
          editor.setData(value);
          suppressOnChangeRef.current = false;
        }

        editor.model.document.on("change:data", () => {
          if (suppressOnChangeRef.current) return;
          const data = editor.getData();
          rawContentRef.current = data;
          onChange(data);
        });
      } catch (error) {
        console.error("Error initializing CKEditor:", error);
        isInitializingRef.current = false;
      }
    };

    if (!isSourceMode) initEditor();

    return () => {
      cancelled = true;
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.destroy();
        } catch {
          /* ignore */
        }
        editorInstanceRef.current = null;
        isInitializingRef.current = false;
        setIsReady(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSourceMode]);

  // Keep the editor in sync when the parent value changes externally.
  useEffect(() => {
    if (
      editorInstanceRef.current &&
      !isSourceMode &&
      value !== editorInstanceRef.current.getData()
    ) {
      suppressOnChangeRef.current = true;
      editorInstanceRef.current.setData(value || "");
      suppressOnChangeRef.current = false;
    }
    rawContentRef.current = value || "";
  }, [value, isSourceMode]);

  const toggleSourceMode = () => {
    if (!isSourceMode) {
      setSourceCode(formatHtml(rawContentRef.current));
      setIsSourceMode(true);
    } else {
      rawContentRef.current = sourceCode;
      onChange(sourceCode);
      setIsSourceMode(false);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setSourceCode(newValue);
    rawContentRef.current = newValue;
    onChange(newValue);
  };

  const insertImage = (url: string) => {
    const editor = editorInstanceRef.current;
    if (!editor) {
      alert("Editor not ready. Please try again.");
      return;
    }
    try {
      const imageHtml = `<figure class="image"><img src="${url}" alt="Uploaded image"></figure>`;
      editor.model.change(() => {
        const viewFragment = editor.data.processor.toView(imageHtml);
        const modelFragment = editor.data.toModel(viewFragment);
        editor.model.insertContent(modelFragment, editor.model.document.selection);
      });
      const newData = editor.getData();
      rawContentRef.current = newData;
      onChange(newData);
    } catch (error) {
      console.error("Error inserting image:", error);
      alert("Failed to insert image into editor");
    }
    setShowImageMenu(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("File size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

      const res = await fetch(`${resolveApiBaseUrl()}/files`, {
        method: "POST",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json?.success && json?.data?.url) {
        insertImage(json.data.url);
      } else {
        throw new Error(json?.message || `Upload failed (${res.status})`);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlInsert = () => {
    if (imageUrl.trim()) {
      insertImage(imageUrl.trim());
      setImageUrl("");
      setShowUrlModal(false);
    }
  };

  return (
    <div className="rte-wrapper rounded-xl border border-gray-300 overflow-hidden">
      {/* Custom action bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowImageMenu((v) => !v)}
            disabled={isSourceMode || !isReady}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-40"
          >
            <FiImage className="h-4 w-4" /> Image
          </button>
          {showImageMenu && (
            <div className="absolute left-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setShowImageMenu(false);
                  fileInputRef.current?.click();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiUpload className="h-4 w-4 text-brand-start" /> Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowImageMenu(false);
                  setShowUrlModal(true);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiLink className="h-4 w-4 text-brand-start" /> By URL
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleSourceMode}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            isSourceMode
              ? "border-transparent bg-brand-gradient text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiCode className="h-4 w-4" /> {isSourceMode ? "Visual" : "Source"}
        </button>

        {isUploading && (
          <span className="text-xs font-medium text-brand-start">Uploading…</span>
        )}
        <span className="ml-auto text-[11px] text-gray-400">
          {isSourceMode ? "Editing raw HTML" : "Visual editor"}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Editor body */}
      {isSourceMode ? (
        <textarea
          value={sourceCode}
          onChange={handleSourceChange}
          spellCheck={false}
          className="block h-[420px] w-full resize-y bg-slate-900 px-4 py-3 font-mono text-sm text-slate-100 outline-none"
          placeholder="<h2>Section</h2><p>Raw HTML…</p>"
        />
      ) : (
        <div ref={editorContainerRef} className="rte-editable" />
      )}

      {/* Insert-by-URL modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Insert image by URL</h3>
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-start focus:ring-1 focus:ring-brand-start"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUrlInsert}
                className="btn-brand rounded-lg px-4 py-2 text-sm font-medium"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
