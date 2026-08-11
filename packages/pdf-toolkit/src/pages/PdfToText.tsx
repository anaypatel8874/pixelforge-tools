import React, { useEffect, useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function PdfToText(){
  const [file, setFile] = useState<File | null>(null)
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [progress, setProgress] = useState<string | null>(null)
  const [text, setText] = useState<string | null>(null)

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

  async function extractText(){
    if(!pdfData) return
    setText('')
    setProgress('Loading PDF...')
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
    let out = ''
    for(let i=1;i<=pdf.numPages;i++){
      setProgress(`Extracting page ${i}/${pdf.numPages}`)
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((i:any)=> i.str).join(' ')
      out += `\n\n--- Page ${i} ---\n\n` + pageText
      await new Promise(r=>setTimeout(r,10))
    }
    setText(out)
    setProgress(null)
  }

  function downloadText(){
    if(!text) return
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (file?.name || 'pdf') + '.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h2>PDF → Text</h2>
      <p>Extract textual content from PDFs (client-side).</p>
      <PDFUploader onFiles={(files)=> setFile(files[0])} accept="application/pdf" multiple={false} />
      <div style={{marginTop:12}}>
        <button onClick={extractText} disabled={!pdfData}>Extract Text</button>
        <button onClick={downloadText} disabled={!text} style={{marginLeft:8}}>Download .txt</button>
      </div>
      {progress && <div style={{marginTop:8}}>{progress}</div>}
      {text && <pre style={{whiteSpace:'pre-wrap', marginTop:12, maxHeight:400, overflow:'auto'}}>{text}</pre>}
    </div>
  )
}
