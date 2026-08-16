import { useRef, useState, useCallback } from 'react'

export function useFileReceiver () {
  const [incomingFile, setIncomingFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)

  const chunksRef = useRef([])
  const receivedBytesRef = useRef(0)
  const expectedSizeRef = useRef(0)
  const mimeTypeRef = useRef('application/octet-stream')  

  const handleData = useCallback(data => {
    if (typeof data === 'string') {
      const message = JSON.parse(data)

      if (message.type === 'file-meta') {
        chunksRef.current = []
        receivedBytesRef.current = 0
        expectedSizeRef.current = message.size
        mimeTypeRef.current = message.mimeType || 'application/octet-stream'

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
        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current })
        setDownloadUrl(URL.createObjectURL(blob))
        setProgress(100)
        return
      }

      return
    }

    chunksRef.current.push(data)
    receivedBytesRef.current += data.byteLength

    if (expectedSizeRef.current) {
      const pct = Math.round(
        (receivedBytesRef.current / expectedSizeRef.current) * 100
      )
      setProgress(pct)
    }
  }, [])

  return { incomingFile, progress, downloadUrl, handleData }
}
