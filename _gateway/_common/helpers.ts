'use server'

export const toFormData = async (o: Object) => {
  const formData = new FormData()
  Object.entries(o).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v))
    } else {
      formData.append(key, value)
    }
  })
  return formData
}
export const toSearchParams = async (o: Object) => {
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
