"use client";

/**
 * ContentPreview
 * -------------------------------------------------------------------------
 * Renders CMS / CKEditor HTML the way it will appear on the live site:
 *  - Sanitizes HTML with DOMPurify (allows safe media embeds / iframes)
 *  - Brand-gradient table headers, zebra rows, mobile-scrollable tables
 *  - Justified paragraphs, left-aligned headings
 * Shared by the dashboard editors (live preview) and can be reused publicly.
 */

import { useEffect, useMemo, useRef } from "react";
import DOMPurify from "dompurify";

interface ContentPreviewProps {
  html: string;
  className?: string;
}

export default function ContentPreview({ html, className = "" }: ContentPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const processedHtml = useMemo(() => {
    if (!html) return "";
    if (typeof window === "undefined") return html;

    const clean = DOMPurify.sanitize(html, {
      ADD_TAGS: ["iframe", "figure", "figcaption", "oembed", "sub", "sup"],
      ADD_ATTR: [
        "allow",
        "allowfullscreen",
        "frameborder",
        "scrolling",
        "src",
        "url",
        "target",
        "class",
        "colspan",
        "rowspan",
      ],
    });

    let result = clean;
    // Justify paragraphs, keep headings left-aligned.
    result = result.replace(/<p(\s|>)/g, '<p style="text-align:justify"$1');
    result = result.replace(/<(h[1-6])(\s|>)/g, '<$1 style="text-align:left"$2');
    return result;
  }, [html]);

  // DOM-level enhancements that can't be done via string processing.
  useEffect(() => {
    if (!contentRef.current) return;

    const tables = contentRef.current.querySelectorAll("figure.table, table");
    tables.forEach((el) => {
      if (el.parentElement?.classList.contains("table-scroll-wrapper")) return;
      if (el.tagName === "TABLE" && el.parentElement?.tagName === "FIGURE") return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll-wrapper";
      el.parentNode?.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    });
  }, [processedHtml]);

  if (!html) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-400">
        Nothing to preview yet. Start writing to see a live preview.
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      className={`cms-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
