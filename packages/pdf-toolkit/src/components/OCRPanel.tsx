import React, { useState } from 'react'
import Tesseract from 'tesseract.js'

export default function OCRPanel({ file }: { file?: File }){
  const [text, setText] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)

  async function runOCR(){
    if(!file) return
    setText(null)
    const { data } = await Tesseract.recognize(await file.arrayBuffer(), { logger: m => {
      if(m.status === 'recognizing text' && typeof m.progress === 'number') setProgress(m.progress)
    }} as any)
    setText(data.text)
  }

  return (
    <div>
      <button onClick={runOCR} disabled={!file}>Run OCR</button>
      {progress>0 && <div>Progress: {(progress*100).toFixed(0)}%</div>}
      {text && <pre style={{whiteSpace:'pre-wrap'}}>{text}</pre>}
    </div>
  )
}
