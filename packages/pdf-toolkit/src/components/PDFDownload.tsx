import React from 'react'
import { saveAs } from 'file-saver'

export default function PDFDownload({ blob, filename }: { blob: Blob, filename?: string }){
  return (
    <div style={{marginTop:12}}>
      <button onClick={()=> saveAs(blob, filename || 'download.pdf')}>Download</button>
    </div>
  )
}
