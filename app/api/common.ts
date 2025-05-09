import { env } from '@/lib/utils/env'
import { NextRequest, NextResponse } from 'next/server'

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers)
  headers.append('Authorization', `Bearer ${env.apiToken}`)

  return fetch(input, { ...init, headers })
}

export async function forwardGET(
  req: NextRequest,
  endpoint: string,
): Promise<NextResponse | Response> {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  try {
    const externalRes = await authFetch(
      `${endpoint}?${searchParams}`,
      {
        method: 'GET',
        headers: req.headers,
      },
    )

    if (!externalRes.ok)
      throw new Error('Server error occurred')

    const body = await externalRes.text()
    const status = externalRes.status

    return new NextResponse(body, { status })
  } catch (err) {
    console.log(err)
    return NextResponse.error()
  }
}

export async function forwardPOST() {}
