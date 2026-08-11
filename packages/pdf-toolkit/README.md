PDF Toolkit (frontend-only)

This package contains a privacy-first, client-side PDF tool workspace scaffold.

Features scaffolded:
- Routes: /pdf-tools, /pdf-tools/merge-pdf (more to add)
- Core components: PDFUploader, PDFViewer, thumbnails, OCR panel, download
- Uses pdf-lib, pdfjs-dist, tesseract.js for in-browser processing

Next steps:
- Implement remaining routes and components (split, compress, convert, OCR languages)
- Add Web Workers for large PDFs and incremental processing
- Add unit/integration tests and CI

To run:
- cd packages/pdf-toolkit
- npm install
- npm run dev
