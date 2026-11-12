import imageCompression from 'browser-image-compression'

const extractFilenameFromUrl = (fn: string) => {
  const urlParts = fn.split('/')
  const rawName =
    urlParts[urlParts.length - 1].split('?')[0]
  return rawName
}

async function urlToFile(
  url: string,
  filename?: string,
): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  const mime = blob.type || 'image/jpeg'
  const rawName = extractFilenameFromUrl(url)
  return new File([blob], filename || rawName, {
    type: mime,
  })
}

const compressFile = async (
  file: File,
  filename?: string,
) => {
  const blob = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  })

  return new File([blob], filename || blob.name, {
    type: blob.type,
  })
}

export const compressedFileFromUrl = async (
  url: string,
) => {
  const file = await urlToFile(url)

  const compressed = await compressFile(file)

  return compressed
}
