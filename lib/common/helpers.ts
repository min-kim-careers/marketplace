import imageCompression from 'browser-image-compression'

const serialize = (object: Object) => {
  return Object.fromEntries(
    Object.entries(object)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== '',
      )
      .map(([key, value]) => [key, String(value)]),
  )
}

export const toUrlParams = (
  object: Object,
) => new URLSearchParams(serialize(object))

export const compressFile = async (file: File) => {
  const blob = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  })

  return new File([blob], blob.name, { type: blob.type })
}

export const formatPrice = (price: string) => {
  const amount = parseFloat(price)
  const formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount)

  return formatted
}

export const delay = async (time: number) =>
  await new Promise((_) => setTimeout(_, time))
