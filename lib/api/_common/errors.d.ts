export interface ErrorResponse {
  detail: {
    errorType: ErrorType
  }
}

export type ErrorType =
  | 'expired_token'
  | 'missing_token'
  | 'invalid_user'
  | 'invalid_token'
  | 'invalid_api_token'
  | 'missing_api_token'
  | 'bad_request'
