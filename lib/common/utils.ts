import imageCompression from 'browser-image-compression'

export const delay = async (time: number) =>
  await new Promise((_) => setTimeout(_, time))

export const cleanPayload = (obj: Object) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  )

export const cleanParam = (param: string) => param.trim()

export const compressFile = async (file: File) => {
  const blob = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  })

  return new File([blob], blob.name, { type: blob.type })
}
