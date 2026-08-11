import React, { useEffect, useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import { Document, Packer, Paragraph, ImageRun } from 'docx'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function PdfToWord(){
  const [file, setFile] = useState<File | null>(null)
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [progress, setProgress] = useState<string | null>(null)

  useEffect(()=>{
    let mounted = true
    async function load(){
      if(!file) return
      setProgress('Reading file...')
      const arr = await file.arrayBuffer()
      if(!mounted) return
      setPdfData(arr)
      setProgress(null)
    }
    load().catch(err=>{ console.error(err); setProgress(null) })
    return ()=>{ mounted = false }
  }, [file])

  async function convert(){
    if(!pdfData) return
    setProgress('Loading PDF...')
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
    const doc = new Document()

    for(let i=1;i<=pdf.numPages;i++){
      setProgress(`Rendering page ${i}/${pdf.numPages}`)
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport }).promise
      const dataUrl = canvas.toDataURL('image/png')
      const base64 = dataUrl.split(',')[1]
      const image = new ImageRun({ data: Uint8Array.from(atob(base64), c=>c.charCodeAt(0)), transformation: { width: canvas.width/2, height: canvas.height/2 } })
      doc.addSection({ children: [ new Paragraph({ children: [ image ] }) ] })
      await new Promise(r=>setTimeout(r,10))
    }

    setProgress('Packing DOCX...')
    const packer = new Packer()
    const blob = await packer.toBlob(doc as any)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (file?.name || 'pdf') + '.docx'
    a.click()
    URL.revokeObjectURL(url)
    setProgress(null)
  }

  return (
    <div>
      <h2>PDF → Word (approx)</h2>
      <p>Best-effort: embeds page images into a .docx. Preserves layout but not selectable text.</p>
      <PDFUploader onFiles={(files)=> setFile(files[0])} accept="application/pdf" multiple={false} />
      <div style={{marginTop:12}}>
        <button onClick={convert} disabled={!pdfData}>Convert to .docx</button>
      </div>
      {progress && <div style={{marginTop:8}}>{progress}</div>}
    </div>
  )
}
