import React, { useEffect, useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import * as XLSX from 'xlsx'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function PdfToExcel(){
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
    const wb: XLSX.WorkBook = { SheetNames: [], Sheets: {} }

    for(let i=1;i<=pdf.numPages;i++){
      setProgress(`Extracting text page ${i}/${pdf.numPages}`)
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((it:any)=> it.str).join('\n')
      const sheetName = `Page ${i}`
      wb.SheetNames.push(sheetName)
      wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet([[pageText]])
      await new Promise(r=>setTimeout(r,10))
    }

    setProgress('Building workbook...')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (file?.name || 'pdf') + '.xlsx'
    a.click()
    URL.revokeObjectURL(url)
    setProgress(null)
  }

  return (
    <div>
      <h2>PDF → Excel (approx)</h2>
      <p>Extracts page text into separate sheets. Best-effort approximation for tabular extraction.</p>
      <PDFUploader onFiles={(files)=> setFile(files[0])} accept="application/pdf" multiple={false} />
      <div style={{marginTop:12}}>
        <button onClick={convert} disabled={!pdfData}>Convert to .xlsx</button>
      </div>
      {progress && <div style={{marginTop:8}}>{progress}</div>}
    </div>
  )
}
