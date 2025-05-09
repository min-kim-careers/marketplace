import { ENDPOINTS } from '@/lib/constants/endpoints'
import { AuthResponse } from '@/lib/interfaces/auth'
import { NextRequest, NextResponse } from 'next/server'
import { authFetch } from '../../common'
import { Profile } from '@/lib/interfaces/users'

interface Response {
  profile: Profile
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const username = body.email as string
    const password = body.password as string

    if (!username || !password)
      throw new Error('Invalid parameters')

    const authRes = await authFetch(
      `${ENDPOINTS.AUTH}/sign-in`,
      {
        method: 'POST',
        body: new URLSearchParams({ username, password }),
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },
      },
    )
    if (!authRes.ok)
      throw new Error('Server error occurred')

    const authData: AuthResponse = await authRes.json()
    if (!authData.user) throw new Error()

    const response = NextResponse.json({
      profile: authData.user as Profile,
    } satisfies Response)

    response.cookies.set(
      'access_token',
      authData.accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: authData.accessTokenExpires,
      },
    )
    response.cookies.set(
      'refresh_token',
      authData.refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: authData.refreshTokenExpires,
      },
    )

    return response
  } catch (err) {
    console.log(err)
    return NextResponse.error()
  }
}
