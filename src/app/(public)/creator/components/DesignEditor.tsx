'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! Start typing here...</p>',
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-4 min-h-[400px]">
      <EditorContent editor={editor} />
    </div>
  );
}