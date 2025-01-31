'use client'

import Market from '@/components/content/market'
import Spinner from '@/components/spinner'
import { extractParams } from '@/helpers/params'
import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()

  const params = extractParams(searchParams)

  if (!params) return <Spinner />

  return <Market params={params} />
}
