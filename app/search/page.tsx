'use client'

import Search from '@/components/content/search'
import Spinner from '@/components/ui/spinner'
import { extractParams } from '@/helpers/params'
import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()

  const params = extractParams(searchParams)

  if (!params) return <Spinner />

  return <Search params={params} />
}
