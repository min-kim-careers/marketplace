'use server'

export const toFormData = async (o: object) => {
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
