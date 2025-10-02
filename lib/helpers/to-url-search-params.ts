export const toURLSearchParams = (o: object) => {
  const params = new URLSearchParams()
  Object.entries(o).forEach(([key, value]) => {
    if (!value) return
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v))
    } else {
      params.append(key, value)
    }
  })
  return params
}
