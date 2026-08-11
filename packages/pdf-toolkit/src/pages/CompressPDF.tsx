import React, { useEffect, useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import PDFDownload from '../components/PDFDownload'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import { PDFDocument, rgb } from 'pdf-lib'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

const PRESETS = [
  { label: 'Target 100 KB', bytes: 100_000 },
  { label: 'Target 200 KB', bytes: 200_000 },
  { label: 'Target 500 KB', bytes: 500_000 },
  { label: 'Target 1 MB', bytes: 1_000_000 },
  { label: 'Target 2 MB', bytes: 2_000_000 }
]

export default function CompressPDF(){
  const [file, setFile] = useState<File | null>(null)
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [progress, setProgress] = useState<string | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [presetIndex, setPresetIndex] = useState(2)
  const [flatten, setFlatten] = useState(false)

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

  // Best-effort compression: render each page to canvas, export JPEG with quality chosen to try reach target size
  async function compress(){
    if(!pdfData) return
    setProgress('Preparing...')
    const target = PRESETS[presetIndex].bytes

    const srcPdf = await pdfjsLib.getDocument({ data: pdfData }).promise
    const outPdf = await PDFDocument.create()

    let totalBytes = pdfData.byteLength
    // Simple heuristic: start with quality 0.75 and adjust per page
    for(let i=1;i<=srcPdf.numPages;i++){
      setProgress(`Rendering page ${i}/${srcPdf.numPages}`)
      const page = await srcPdf.getPage(i)
      const viewport = page.getViewport({ scale: 1.5 })

      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport }).promise

      // Binary search on quality to try approach per-page target
      let quality = 0.8
      let jpegBlob = await new Promise<Blob | null>(res => canvas.toBlob(b=>res(b), 'image/jpeg', quality))
      if(!jpegBlob) throw new Error('Failed to create JPEG blob')

      // Adjust quality down while result too large and quality > 0.2
      let attempts = 0
      while(jpegBlob.size > Math.max(20_000, target / srcPdf.numPages) && quality > 0.2 && attempts < 6){
        quality -= 0.15
        jpegBlob = await new Promise<Blob | null>(res => canvas.toBlob(b=>res(b), 'image/jpeg', quality))
        attempts++
      }

      const imgBytes = new Uint8Array(await jpegBlob.arrayBuffer())
      const img = await outPdf.embedJpg(imgBytes)
      const pageDims = outPdf.addPage([img.width, img.height])
      pageDims.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      totalBytes += imgBytes.length
      setProgress(`Added page ${i}, size ${(imgBytes.length/1024).toFixed(1)} KB`)
      await new Promise(r=>setTimeout(r,10))
    }

    setProgress('Serializing compressed PDF...')
    const outBytes = await outPdf.save()
    const blob = new Blob([outBytes], { type: 'application/pdf' })
    setResultBlob(blob)
    setProgress(null)
  }

  async function removeMetadata(){
    if(!pdfData) return
    setProgress('Removing metadata...')
    const src = await PDFDocument.load(pdfData)
    const out = await PDFDocument.create()
    const pages = await out.copyPages(src, src.getPageIndices())
    pages.forEach(p=> out.addPage(p))
    // intentionally do not copy metadata
    const bytes = await out.save()
    setResultBlob(new Blob([bytes], { type: 'application/pdf' }))
    setProgress(null)
  }

  return (
    <div>
      <h2>Compress PDF</h2>
      <p>Client-side, best-effort compression by rasterizing pages and rebuilding PDF. Preserves privacy.</p>
      <PDFUploader onFiles={(files)=> setFile(files[0])} accept="application/pdf" multiple={false} />

      <div style={{marginTop:12}}>
        <label>Preset:</label>
        <select value={presetIndex} onChange={e=> setPresetIndex(parseInt(e.target.value,10))}>
          {PRESETS.map((p, idx)=> <option key={idx} value={idx}>{p.label}</option>)}
        </select>
        <label style={{marginLeft:12}}><input type="checkbox" checked={flatten} onChange={e=> setFlatten(e.target.checked)} /> Flatten (rasterize, remove form fields)</label>
      </div>

      {progress && <div style={{marginTop:8}}>{progress}</div>}

      <div style={{marginTop:12}}>
        <button onClick={compress} disabled={!pdfData}>Compress</button>
        <button onClick={removeMetadata} disabled={!pdfData} style={{marginLeft:8}}>Remove Metadata</button>
      </div>

      {resultBlob && (
        <div style={{marginTop:12}}>
          <PDFDownload blob={resultBlob} filename={flatten ? 'compressed-flattened.pdf' : 'compressed.pdf'} />
        </div>
      )}
    </div>
  )
}
