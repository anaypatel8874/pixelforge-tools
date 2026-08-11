import React, { useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function ComparePDF(){
  const [fileA, setFileA] = useState<File | null>(null)
  const [fileB, setFileB] = useState<File | null>(null)
  const [page, setPage] = useState(1)
  const [progress, setProgress] = useState<string | null>(null)
  const canvasARef = React.useRef<HTMLCanvasElement | null>(null)
  const canvasBRef = React.useRef<HTMLCanvasElement | null>(null)

  async function renderPage(file: File | null, canvas: HTMLCanvasElement | null, pageNum=1){
    if(!file || !canvas) return
    const arr = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arr }).promise
    if(pageNum < 1 || pageNum > pdf.numPages) return
    const p = await pdf.getPage(pageNum)
    const vp = p.getViewport({ scale: 1.5 })
    canvas.width = vp.width
    canvas.height = vp.height
    const ctx = canvas.getContext('2d')!
    await p.render({ canvasContext: ctx, viewport: vp }).promise
  }

  async function renderBoth(){
    setProgress('Rendering A...')
    await renderPage(fileA, canvasARef.current, page)
    setProgress('Rendering B...')
    await renderPage(fileB, canvasBRef.current, page)
    setProgress(null)
  }

  return (
    <div>
      <h2>Compare PDFs</h2>
      <p>Render and visually compare a page from two PDFs side-by-side.</p>
      <div style={{display:'flex', gap:12}}>
        <div>
          <label>A:</label>
          <PDFUploader onFiles={(files)=> setFileA(files[0])} accept="application/pdf" multiple={false} />
        </div>
        <div>
          <label>B:</label>
          <PDFUploader onFiles={(files)=> setFileB(files[0])} accept="application/pdf" multiple={false} />
        </div>
      </div>
      <div style={{marginTop:12}}>
        <label>Page:</label>
        <input type="number" value={page} onChange={e=> setPage(parseInt(e.target.value||'1',10))} min={1} />
        <button onClick={renderBoth} style={{marginLeft:8}}>Render</button>
      </div>
      {progress && <div style={{marginTop:8}}>{progress}</div>}
      <div style={{display:'flex', gap:12, marginTop:12}}>
        <canvas ref={canvasARef} style={{border:'1px solid #ddd'}} />
        <canvas ref={canvasBRef} style={{border:'1px solid #ddd'}} />
      </div>
    </div>
  )
}
