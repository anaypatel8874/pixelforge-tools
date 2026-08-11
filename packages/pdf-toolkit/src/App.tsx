import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import PDFToolsIndex from './pages/PDFToolsIndex'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import PdfToImage from './pages/PdfToImage'
import PdfToText from './pages/PdfToText'
import PdfToWord from './pages/PdfToWord'
import PdfToExcel from './pages/PdfToExcel'
import PdfToPptx from './pages/PdfToPptx'
import OcrPDF from './pages/OcrPDF'
import MetadataViewer from './pages/MetadataViewer'
import ComparePDF from './pages/ComparePDF'
import ImagesToPdf from './pages/ImagesToPdf'
import JpgToPdf from './pages/JpgToPdf'
import PngToPdf from './pages/PngToPdf'
import WebpToPdf from './pages/WebpToPdf'
import BlankPdf from './pages/BlankPdf'

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
        <Route path="/pdf-tools/pdf-to-jpg" element={<PdfToImage />} />
        <Route path="/pdf-tools/pdf-to-text" element={<PdfToText />} />
        <Route path="/pdf-tools/pdf-to-word" element={<PdfToWord />} />
        <Route path="/pdf-tools/pdf-to-excel" element={<PdfToExcel />} />
        <Route path="/pdf-tools/pdf-to-pptx" element={<PdfToPptx />} />
        <Route path="/pdf-tools/ocr-pdf" element={<OcrPDF />} />
        <Route path="/pdf-tools/metadata" element={<MetadataViewer />} />
        <Route path="/pdf-tools/compare-pdf" element={<ComparePDF />} />

        {/* Image → PDF single-feature tools */}
        <Route path="/pdf-tools/images-to-pdf" element={<ImagesToPdf />} />
        <Route path="/pdf-tools/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/pdf-tools/png-to-pdf" element={<PngToPdf />} />
        <Route path="/pdf-tools/webp-to-pdf" element={<WebpToPdf />} />
        <Route path="/pdf-tools/blank-pdf" element={<BlankPdf />} />

        {/* Additional routes will be added here */}
      </Routes>
    </div>
  )
}
