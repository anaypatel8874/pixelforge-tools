import React, { useEffect, useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import PDFPageThumbnail from '../components/PDFPageThumbnail'
import PDFDownload from '../components/PDFDownload'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import { PDFDocument } from 'pdf-lib'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function SplitPDF(){
  const [file, setFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [selected, setSelected] = useState<Record<number,boolean>>({})
  const [progress, setProgress] = useState<string | null>(null)
  
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
      setSelected({})
      setProgress(null)
    }
    load().catch(err=>{ console.error(err); setProgress(null) })
    return ()=>{ mounted = false }
  }, [file])

  async function extractSelectedAsSingle(){
    if(!pdfData) return
    setProgress('Loading source...')
    const src = await PDFDocument.load(pdfData)
    const out = await PDFDocument.create()
    const indices = Object.keys(selected).map(k=>parseInt(k,10)).filter(i=> selected[i]).map(i=> i-1)
    if(indices.length === 0){ alert('Select pages to extract'); return }
    setProgress('Copying pages...')
    const pages = await out.copyPages(src, indices)
    pages.forEach(p=> out.addPage(p))
    setProgress('Serializing...')
    const bytes = await out.save()
    setProgress(null)
    const blob = new Blob([bytes], { type: 'application/pdf' })
    saveAs(blob, 'extracted.pdf')
  }

  async function saveEachPageAsPdf(){
    if(!pdfData) return
    setProgress('Loading source...')
    const src = await PDFDocument.load(pdfData)
    const zip = new JSZip()

    for(let i=0;i<src.getPageCount();i++){
      setProgress(`Processing page ${i+1}/${src.getPageCount()}`)
      const out = await PDFDocument.create()
      const [p] = await out.copyPages(src, [i])
      out.addPage(p)
      const bytes = await out.save()
      zip.file(`page-${i+1}.pdf`, bytes)
    }

    setProgress('Packaging ZIP...')
    const content = await zip.generateAsync({ type: 'blob' })
    setProgress(null)
    saveAs(content, 'pages.zip')
  }

  function togglePage(n: number){
    setSelected(s => ({ ...s, [n]: !s[n] }))
  }

  return (
    <div>
      <h2>Split / Extract Pages</h2>
      <p>Upload a PDF to extract pages. Works fully in-browser; preserves privacy.</p>
      <PDFUploader onFiles={(files)=> setFile(files[0])} accept="application/pdf" multiple={false} />

      {progress && <div style={{marginTop:8}}>{progress}</div>}
      {pdfData && (
        <div>
          <div style={{marginTop:12, display:'flex', gap:12, alignItems:'center'}}>
            <button onClick={extractSelectedAsSingle}>Extract selected → single PDF</button>
            <button onClick={saveEachPageAsPdf}>Save each page as PDF (ZIP)</button>
          </div>

          <div style={{marginTop:16}} className="thumbnail-grid">
            {Array.from({ length: numPages }).map((_, idx)=> (
              <div key={idx} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <label style={{cursor:'pointer'}}>
                  <input type="checkbox" checked={!!selected[idx+1]} onChange={()=> togglePage(idx+1)} />
                  <div style={{width:120,height:160}}>
                    <PDFPageThumbnail pdfData={pdfData} pageNumber={idx+1} />
                  </div>
                </label>
                <div style={{fontSize:12}}>Page {idx+1}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
