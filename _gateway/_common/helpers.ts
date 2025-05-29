export const logError = (error: any) => {
  if (error instanceof Error) {
    console.error(
      JSON.stringify(
        {
          error: {
            message: error.message,
            cause: error.cause,
          } as Error,
        },
        null,
        2,
      ),
    )
  }
}
