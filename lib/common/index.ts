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
