// CKEditor classic build ships without bundled TS types for our usage pattern
// (we call ClassicEditor.create directly on a DOM node). Declare it loosely.
declare module '@ckeditor/ckeditor5-build-classic';
