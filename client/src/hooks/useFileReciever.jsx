import { useRef, useState, useCallback } from 'react'

export function useFileReceiver () {
  const [incomingFile, setIncomingFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)

  const chunksRef = useRef([])
  const receivedBytesRef = useRef(0)

  const handleData = useCallback(
    data => {
      if (typeof data === 'string') {
        const message = JSON.parse(data)

        if (message.type === 'file-meta') {
          chunksRef.current = []
          receivedBytesRef.current = 0
          setProgress(0)
          setDownloadUrl(null)
          setIncomingFile({
            name: message.name,
            size: message.size,
            mimeType: message.mimeType
          })
          return
        }

        if (message.type === 'file-end') {
          const blob = new Blob(chunksRef.current, {
            type: incomingFile?.mimeType || 'application/octet-stream'
          })
          setDownloadUrl(URL.createObjectURL(blob))
          setProgress(100)
          return
        }
      }

      chunksRef.current.push(data)
      receivedBytesRef.current += data.byteLength

      if (incomingFile?.size) {
        setProgress(
          Math.round((receivedBytesRef.current / incomingFile.size) * 100)
        )
      }
    },
    [incomingFile]
  )

  return { incomingFile, progress, downloadUrl, handleData }
}
