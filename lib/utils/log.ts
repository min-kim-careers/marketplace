'use server'

export const logError = async (error: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error)
  }
}

export const logInfo = async (error: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.info(error)
  }
}
