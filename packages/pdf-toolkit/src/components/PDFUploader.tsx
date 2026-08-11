import React, { useCallback, useRef } from 'react'

type Props = {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
}

export default function PDFUploader({ onFiles, accept = "application/pdf,image/*,text/plain,application/msword", multiple = false }: Props){
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    const files = e.target.files ? Array.from(e.target.files) : []
    if(files.length) onFiles(files)
    if(inputRef.current) inputRef.current.value = ''
  }, [onFiles])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>)=>{
    e.preventDefault()
    const items = Array.from(e.dataTransfer.files || [])
    if(items.length) onFiles(items)
  }, [onFiles])

  return (
    <div>
      <div className="uploader" onDrop={handleDrop} onDragOver={(e)=>e.preventDefault()} onClick={()=>inputRef.current?.click()} role="button">
        <p>Drag & Drop files here, or click to choose</p>
        <small>Supports PDFs, images, text. Multiple files: {multiple ? 'on' : 'off'}</small>
      </div>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleInput} style={{display:'none'}} />
    </div>
  )
}
