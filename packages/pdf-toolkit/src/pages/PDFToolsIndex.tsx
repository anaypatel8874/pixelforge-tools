import React from 'react'
import { Link } from 'react-router-dom'
import PDFUploader from '../components/PDFUploader'

export default function PDFToolsIndex(){
  return (
    <div>
      <h2>PDF Tools Directory</h2>
      <p>Category: Conversion • Editing • OCR • Security • Compression</p>

      <section style={{marginTop:16}}>
        <h3>Quick Actions</h3>
        <ul>
          <li><Link to="/pdf-tools/merge-pdf">Merge PDF</Link></li>
          <li><Link to="/pdf-tools/split-pdf">Split PDF</Link></li>
          <li><Link to="/pdf-tools/compress-pdf">Compress PDF</Link></li>
          <li><Link to="/pdf-tools/pdf-to-jpg">PDF → JPG/PNG/WebP</Link></li>
          <li><Link to="/pdf-tools/pdf-to-text">PDF → Text</Link></li>
          <li><Link to="/pdf-tools/pdf-to-word">PDF → Word</Link></li>
          <li><Link to="/pdf-tools/pdf-to-excel">PDF → Excel</Link></li>
          <li><Link to="/pdf-tools/pdf-to-pptx">PDF → PowerPoint</Link></li>
          <li><Link to="/pdf-tools/ocr-pdf">OCR PDF</Link></li>
          <li><Link to="/pdf-tools/metadata">Metadata Viewer</Link></li>
          <li><Link to="/pdf-tools/compare-pdf">Compare PDFs</Link></li>
        </ul>
      </section>

      <section style={{marginTop:16}}>
        <h3>Upload</h3>
        <PDFUploader onFiles={(files)=>{ console.log('uploaded', files) }} />
      </section>
    </div>
  )
}
