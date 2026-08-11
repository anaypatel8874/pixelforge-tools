import React, { useState } from 'react'
import PDFUploader from '../components/PDFUploader'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'

async function fileToImageData(file: File): Promise<{data: Uint8Array, mime: string}>{
  // Convert file to usable image bytes. For webp or other unsupported, draw to canvas and export PNG
  const dataUrl = await new Promise<string>((res, rej) => {
    const reader = new FileReader()
    reader.onload = ()=> res(reader.result as string)
    reader.onerror = rej
    reader.readAsDataURL(file)
  })

  // create image
  const img = document.createElement('img')
  img.src = dataUrl
  await new Promise<void>((resolve, reject)=>{ img.onload = ()=> resolve(); img.onerror = ()=> reject(new Error('Image load error')) })

  // If image is JPEG or PNG, return original bytes
  const mime = dataUrl.substring(dataUrl.indexOf(':')+1, dataUrl.indexOf(';'))
  if(mime === 'image/jpeg' || mime === 'image/png'){
    const arrBuf = await file.arrayBuffer()
    return { data: new Uint8Array(arrBuf), mime }
  }

  // Otherwise (webp, svg, etc) rasterize to PNG via canvas
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const pngBlob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png', 0.92))
  if(!pngBlob) throw new Error('Failed to convert image to PNG')
  const arr = new Uint8Array(await pngBlob.arrayBuffer())
  return { data: arr, mime: 'image/png' }
}

export default function ImageToPdf({ accept = 'image/*', title = 'Images → PDF' }: { accept?: string, title?: string }){
  const [progress, setProgress] = useState<string | null>(null)

  async function handleFiles(files: File[]){
    if(files.length === 0) return
    setProgress('Creating PDF...')
    try{
      const pdf = await PDFDocument.create()
      for(let i=0;i<files.length;i++){
        setProgress(`Processing ${i+1}/${files.length}: ${files[i].name}`)
        const { data, mime } = await fileToImageData(files[i])
        let imgEmbed: any
        if(mime === 'image/png') imgEmbed = await pdf.embedPng(data)
        else imgEmbed = await pdf.embedJpg(data)
        const page = pdf.addPage([imgEmbed.width, imgEmbed.height])
        page.drawImage(imgEmbed, { x: 0, y: 0, width: imgEmbed.width, height: imgEmbed.height })
      }
      setProgress('Serializing PDF...')
      const bytes = await pdf.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      saveAs(blob, 'images-to-pdf.pdf')
      setProgress(null)
    }catch(err){
      console.error(err)
      setProgress(null)
      alert('Failed to create PDF: '+(err as Error).message)
    }
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>Convert one or more images to a single PDF. Works fully in-browser.</p>
      <PDFUploader onFiles={handleFiles} accept={accept} multiple />
      {progress && <div style={{marginTop:8}}>{progress}</div>}
    </div>
  )
}
