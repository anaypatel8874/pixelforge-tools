import React, { useEffect, useRef, useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import Tesseract from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function OcrPDF(){
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<string | null>(null)
  const [lang, setLang] = useState('eng')
  const abortRef = useRef({ aborted: false })

  useEffect(()=>{ return ()=>{ abortRef.current.aborted = true } }, [])

  async function runOCR(){
    if(!file) return
    abortRef.current.aborted = false
    setProgress('Loading PDF...')
    const arr = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arr }).promise
    const zip = new JSZip()

    for(let i=1;i<=pdf.numPages;i++){
      if(abortRef.current.aborted) break
      setProgress(`Rendering page ${i}/${pdf.numPages}`)
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport }).promise

      setProgress(`OCR page ${i}`)
      const { data } = await Tesseract.recognize(canvas, lang, { logger: m => {
        if(m.status === 'recognizing text') setProgress(`OCR page ${i}: ${(m.progress*100).toFixed(0)}%`)
      } })
      zip.file(`page-${i}.txt`, data.text)
      await new Promise(r=>setTimeout(r,10))
    }

    if(abortRef.current.aborted){ setProgress('Cancelled'); return }
    setProgress('Packaging ZIP...')
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, (file?.name || 'ocr') + '-ocr-texts.zip')
    setProgress(null)
  }

  return (
    <div>
      <h2>OCR PDF</h2>
      <p>Run OCR on PDF pages (client-side). Choose Hindi (hin) or English (eng) or auto via 'eng+hin'.</p>
      <PDFUploader onFiles={(files)=> setFile(files[0])} accept="application/pdf,image/*" multiple={false} />
      <div style={{marginTop:12}}>
        <label>Language:</label>
        <select value={lang} onChange={e=> setLang(e.target.value)}>
          <option value="eng">English (eng)</option>
          <option value="hin">Hindi (hin)</option>
          <option value="eng+hin">Automatic (eng+hin)</option>
        </select>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={runOCR} disabled={!file}>Run OCR</button>
        <button onClick={()=> { abortRef.current.aborted = true; setProgress('Cancelling...') }} style={{marginLeft:8}}>Cancel</button>
      </div>
      {progress && <div style={{marginTop:8}}>{progress}</div>}
    </div>
  )
}
