import React, { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'

export default function BlankPdf(){
  const [pages, setPages] = useState<number>(1)
  const [width, setWidth] = useState<number>(595) // A4 portrait points ~595x842
  const [height, setHeight] = useState<number>(842)
  const [progress, setProgress] = useState<string | null>(null)

  async function createBlank(){
    setProgress('Creating PDF...')
    const pdf = await PDFDocument.create()
    for(let i=0;i<pages;i++){
      pdf.addPage([width, height])
    }
    const bytes = await pdf.save()
    const blob = new Blob([bytes], { type: 'application/pdf' })
    saveAs(blob, 'blank.pdf')
    setProgress(null)
  }

  return (
    <div>
      <h2>Blank PDF</h2>
      <p>Create a blank PDF with custom page count and size (points).</p>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <label>Pages:</label>
        <input type="number" min={1} value={pages} onChange={e=> setPages(parseInt(e.target.value||'1',10))} />
        <label>Width (pt):</label>
        <input type="number" value={width} onChange={e=> setWidth(parseInt(e.target.value||'595',10))} />
        <label>Height (pt):</label>
        <input type="number" value={height} onChange={e=> setHeight(parseInt(e.target.value||'842',10))} />
      </div>
      <div style={{marginTop:8}}>
        <button onClick={createBlank}>Create Blank PDF</button>
      </div>
      {progress && <div style={{marginTop:8}}>{progress}</div>}
    </div>
  )
}
