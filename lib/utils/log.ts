export const logError = (error: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error)
  }
}

export const logInfo = (error: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.info(error)
  }
}
