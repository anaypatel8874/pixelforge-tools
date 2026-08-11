import React, { useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function PDFViewer({ file }: { file: File | null }){
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(()=>{
    let cancelled = false
    async function render(){
      if(!file || !canvasRef.current) return
      const array = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: array }).promise
      const page = await pdf.getPage(1)
      const viewport = page.getViewport({ scale: 1.2 })
      const canvas = canvasRef.current!
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!
      const renderCtx = { canvasContext: ctx, viewport }
      await page.render(renderCtx).promise
      if(cancelled) return
    }
    render()
    return ()=>{ cancelled = true }
  }, [file])

  return <canvas ref={canvasRef} style={{width:'100%', border:'1px solid #eee'}} />
}
