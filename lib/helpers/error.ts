const extractUserErrorMessage = (
  error: any,
  fallback: string,
) => {
  return (
    (error instanceof Error && error.message) || fallback
  )
}
