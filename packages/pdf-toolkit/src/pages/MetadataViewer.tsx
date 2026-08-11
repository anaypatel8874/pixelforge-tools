import React, { useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import { PDFDocument } from 'pdf-lib'

export default function MetadataViewer(){
  const [file, setFile] = useState<File | null>(null)
  const [meta, setMeta] = useState<Record<string, any> | null>(null)
  const [edited, setEdited] = useState<Record<string,string>>({})

  async function load(){
    if(!file) return
    const arr = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arr)
    setMeta(pdf.getTitle ? {
      title: pdf.getTitle && pdf.getTitle(),
      author: pdf.getAuthor && pdf.getAuthor(),
      subject: pdf.getSubject && pdf.getSubject(),
      keywords: pdf.getKeywords && pdf.getKeywords()
    } : {})
  }

  async function save(){
    if(!file || !meta) return
    const arr = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arr)
    if(edited.title) pdf.setTitle(edited.title)
    if(edited.author) pdf.setAuthor(edited.author)
    if(edited.subject) pdf.setSubject(edited.subject)
    if(edited.keywords) pdf.setKeywords(edited.keywords)
    const bytes = await pdf.save()
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (file?.name || 'pdf') + '.metadata.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h2>Metadata Viewer / Editor</h2>
      <p>View and edit PDF metadata (Title, Author, Subject, Keywords).</p>
      <PDFUploader onFiles={(files)=> setFile(files[0])} accept="application/pdf" multiple={false} />
      <div style={{marginTop:12}}>
        <button onClick={load} disabled={!file}>Load Metadata</button>
      </div>
      {meta && (
        <div style={{marginTop:12}}>
          <div>
            <label>Title:</label>
            <input defaultValue={meta.title || ''} onChange={e=> setEdited(s=> ({...s, title: e.target.value}))} />
          </div>
          <div>
            <label>Author:</label>
            <input defaultValue={meta.author || ''} onChange={e=> setEdited(s=> ({...s, author: e.target.value}))} />
          </div>
          <div>
            <label>Subject:</label>
            <input defaultValue={meta.subject || ''} onChange={e=> setEdited(s=> ({...s, subject: e.target.value}))} />
          </div>
          <div>
            <label>Keywords:</label>
            <input defaultValue={meta.keywords || ''} onChange={e=> setEdited(s=> ({...s, keywords: e.target.value}))} />
          </div>
          <div style={{marginTop:8}}>
            <button onClick={save}>Save PDF with metadata</button>
          </div>
        </div>
      )}
    </div>
  )
}
