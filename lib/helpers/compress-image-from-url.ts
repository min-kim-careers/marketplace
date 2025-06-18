import imageCompression from 'browser-image-compression'

async function urlToFile(
  url: string,
  fallbackName = 'image.jpg',
): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  const mime = blob.type || 'image/jpeg'

  const urlParts = url.split('/')
  const rawName =
    urlParts[urlParts.length - 1].split('?')[0]
  const filename = rawName || fallbackName

  return new File([blob], filename, { type: mime })
}

const compressFile = async (file: File) => {
  const blob = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  })

  return new File([blob], blob.name, { type: blob.type })
}

export const compressImageFromUrl = async (url: string) => {
  const image = await urlToFile(url)
  const compressed = await compressFile(image)
  return compressed
}

