import { AxiosError } from 'axios'

export const logError = (error: any) => {
  console.error(error);
  
  // if (error instanceof AxiosError) {
  //   console.error(
  //     JSON.stringify(error.response?.data.detail, null, 2),
  //   )
  // } else if (error instanceof Error) {
  //   console.error(
  //     JSON.stringify(
  //       {
  //         error: {
  //           message: error.message,
  //           cause: error.cause,
  //         } as Error,
  //       },
  //       null,
  //       2,
  //     ),
  //   )
  // } else {
  //   console.error(error)
  // }
}
