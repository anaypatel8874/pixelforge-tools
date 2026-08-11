import React, { useEffect, useState, useRef } from 'react'
import PDFUploader from '../components/PDFUploader'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function PdfToImage(){
  const [file, setFile] = useState<File | null>(null)
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [progress, setProgress] = useState<string | null>(null)
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg')
  const [quality, setQuality] = useState<number>(0.8)
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false })

  useEffect(()=>{
    let mounted = true
    async function load(){
      if(!file) return
      setProgress('Reading file...')
      const arr = await file.arrayBuffer()
      if(!mounted) return
      setPdfData(arr)
      setProgress('Parsing PDF...')
      const pdf = await pdfjsLib.getDocument({ data: arr }).promise
      if(!mounted) return
      setNumPages(pdf.numPages)
      setProgress(null)
    }
    load().catch(err=>{ console.error(err); setProgress(null) })
    return ()=>{ mounted = false }
  }, [file])

  function cancel(){ abortRef.current.aborted = true; setProgress('Cancelled') }

  async function exportImages(singlePerPage = false){
    if(!pdfData) return
    abortRef.current.aborted = false
    setProgress('Loading PDF...')
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
    const zip = new JSZip()
    const pages = pdf.numPages

    for(let i=1;i<=pages;i++){
      if(abortRef.current.aborted) break
      setProgress(`Rendering page ${i}/${pages}`)
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport }).promise

      // convert to blob
      const blob: Blob | null = await new Promise(res => canvas.toBlob(res, format, quality))
      if(!blob) throw new Error('Failed to export image blob')

      const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg'
      const filename = `page-${i}.${ext}`

      if(singlePerPage){
        saveAs(blob, filename)
      } else {
        zip.file(filename, blob)
      }

      // free canvas memory
      ctx.clearRect(0,0,canvas.width, canvas.height)
      await new Promise(r=>setTimeout(r, 10))
    }

    if(!abortRef.current.aborted && !singlePerPage){
      setProgress('Packaging ZIP...')
      const content = await zip.generateAsync({ type: 'blob' }, (meta)=> setProgress(`Packaging: ${Math.round(meta.percent)}%`))
      setProgress(null)
      saveAs(content, 'pdf-images.zip')
    }

    if(abortRef.current.aborted) setProgress('Cancelled')
  }

  return (
    <div>
      <h2>PDF → Image</h2>
      <p>Convert PDF pages to JPG/PNG/WebP in-browser. Incremental processing and ZIP packaging.</p>

      <PDFUploader onFiles={(files)=> setFile(files[0])} accept="application/pdf" multiple={false} />

      <div style={{marginTop:12}}>
        <label>Format: </label>
        <select value={format} onChange={e=> setFormat(e.target.value as any)}>
          <option value="image/jpeg">JPG (small)</option>
          <option value="image/png">PNG (lossless)</option>
          <option value="image/webp">WebP (good quality)</option>
        </select>

        <label style={{marginLeft:12}}>Quality: </label>
        <input type="range" min={0.2} max={1} step={0.05} value={quality} onChange={e=> setQuality(parseFloat(e.target.value))} />
        <span style={{marginLeft:8}}>{Math.round(quality*100)}%</span>
      </div>

      <div style={{marginTop:12}}>
        <button onClick={()=> exportImages(false)} disabled={!pdfData}>Download ZIP of all pages</button>
        <button onClick={()=> exportImages(true)} disabled={!pdfData} style={{marginLeft:8}}>Download each page individually</button>
        <button onClick={cancel} style={{marginLeft:8}}>Cancel</button>
      </div>

      {progress && <div style={{marginTop:8}}>{progress}</div>}

      <div style={{marginTop:12}}>
        {pdfData && <div>Pages: {numPages}</div>}
      </div>
    </div>
  )
}
