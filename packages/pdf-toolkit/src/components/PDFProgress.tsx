import React from 'react'

export default function PDFProgress({ label }: { label?: string }){
  return (
    <div style={{marginTop:8}}>
      <progress /> {label}
    </div>
  )
}
