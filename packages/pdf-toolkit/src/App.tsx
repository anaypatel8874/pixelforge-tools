import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import PDFToolsIndex from './pages/PDFToolsIndex'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>PDF Toolkit</h1>
        <nav>
          <Link to="/pdf-tools">Tools</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<PDFToolsIndex />} />
        <Route path="/pdf-tools" element={<PDFToolsIndex />} />
        <Route path="/pdf-tools/merge-pdf" element={<MergePDF />} />
        <Route path="/pdf-tools/split-pdf" element={<SplitPDF />} />
        <Route path="/pdf-tools/compress-pdf" element={<CompressPDF />} />
        {/* Additional routes will be added here */}
      </Routes>
    </div>
  )
}
