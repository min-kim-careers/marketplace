import { ENDPOINTS } from '@/lib/constants/endpoints'
import { NextRequest, NextResponse } from 'next/server'
import { authFetch } from '../common'

const endpoint = ENDPOINTS.ITEMS

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  try {
    const externalRes = await authFetch(
      `${endpoint}?${searchParams}`,
    )
    if (!externalRes.ok) throw new Error('Server error occurred')

    const body = await externalRes.text()
    const status = externalRes.status

    return new NextResponse(body, { status })
  } catch (err) {
    console.log(err)
    return NextResponse.error()
  }
}
