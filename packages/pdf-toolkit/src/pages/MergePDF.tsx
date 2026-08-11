import React, { useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import PDFDownload from '../components/PDFDownload'
import { PDFDocument } from 'pdf-lib'

export default function MergePDF(){
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null)
  const [progress, setProgress] = useState<string | null>(null)

  async function handleFiles(files: File[]){
    setProgress('Loading files...')
    try{
      const mergedPdf = await PDFDocument.create()
      for(const f of files){
        const array = await f.arrayBuffer()
        const src = await PDFDocument.load(array)
        const copied = await mergedPdf.copyPages(src, src.getPageIndices())
        copied.forEach(p=> mergedPdf.addPage(p))
      }
      setProgress('Serializing merged PDF...')
      const out = await mergedPdf.save()
      setMergedBlob(new Blob([out], { type: 'application/pdf' }))
      setProgress(null)
    }catch(err){
      console.error(err)
      setProgress(null)
      alert('Merge failed: '+(err as Error).message)
    }
  }

  return (
    <div>
      <h2>Merge PDF</h2>
      <p>Drag multiple PDFs (or use file picker). Merges client-side using pdf-lib.</p>
      <PDFUploader onFiles={handleFiles} accept="application/pdf" multiple />
      {progress && <div style={{marginTop:8}}>{progress}</div>}
      {mergedBlob && <PDFDownload blob={mergedBlob} filename="merged.pdf" />}
    </div>
  )
}
