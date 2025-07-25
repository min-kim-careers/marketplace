'use server'

export const encodeParams = async (obj: Object, key: string): Promise<string> => {
  const jsonStr = JSON.stringify(obj)
  const encoded = Buffer.from(jsonStr).toString('base64')
  const urlParams = new URLSearchParams({ [key]: encoded })
  return urlParams.toString()
}

export const decodeParams = async (encoded: string): Promise<any | null> => {
  const decodedJson = Buffer.from(encoded, 'base64').toString('utf-8')
  return JSON.parse(decodedJson)
}
