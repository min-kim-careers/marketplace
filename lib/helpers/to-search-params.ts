export const toSearchParams = (o: Object) => {
  const params = new URLSearchParams()
  Object.entries(o).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v))
    } else {
      params.append(key, value)
    }
  })
  return params
}
