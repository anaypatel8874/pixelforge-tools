import React, { useEffect, useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import PptxGenJS from 'pptxgenjs'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function PdfToPptx(){
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
    const pptx = new PptxGenJS()

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

      const slide = pptx.addSlide()
      slide.addImage({ data: dataUrl, x: 0, y: 0, w: pptx.width, h: pptx.height })
      await new Promise(r=>setTimeout(r,10))
    }

    setProgress('Exporting PPTX...')
    await pptx.writeFile({ fileName: (file?.name || 'pdf') + '.pptx' })
    setProgress(null)
  }

  return (
    <div>
      <h2>PDF → PowerPoint (approx)</h2>
      <p>Embeds each PDF page as a slide image.</p>
      <PDFUploader onFiles={(files)=> setFile(files[0])} accept="application/pdf" multiple={false} />
      <div style={{marginTop:12}}>
        <button onClick={convert} disabled={!pdfData}>Convert to .pptx</button>
      </div>
      {progress && <div style={{marginTop:8}}>{progress}</div>}
    </div>
  )
}
