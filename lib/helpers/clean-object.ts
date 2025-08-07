export const cleanObject = (obj: Object) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v))
