import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js'

export default function PDFPageThumbnail({ pdfData, pageNumber = 1 }: { pdfData: ArrayBuffer, pageNumber?: number }){
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(()=>{
    let mounted = true
    async function draw(){
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
      const page = await pdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 0.5 })
      const canvas = canvasRef.current!
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport }).promise
      if(mounted) setLoaded(true)
    }
    draw().catch(()=>{})
    return ()=>{ mounted = false }
  }, [pdfData, pageNumber])

  return <div className="thumbnail"><canvas ref={canvasRef} /></div>
}
