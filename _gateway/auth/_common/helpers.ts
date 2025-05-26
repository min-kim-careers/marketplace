import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/lib/constants/keys'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const setAccessToken = (
  cookieStore: ReadonlyRequestCookies,
  accessToken: string,
  accessTokenExpires: number,
) => {
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: accessTokenExpires,
  })
}

export const setRefreshToken = (
  cookieStore: ReadonlyRequestCookies,
  refreshToken: string,
) => {
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}