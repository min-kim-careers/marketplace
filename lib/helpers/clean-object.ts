export const cleanObject = (obj: object) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v))
