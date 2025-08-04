'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default async function Reauth({ next }: { next: string }) {
  const router = useRouter()

  useEffect(() => {}, [])

  return null
}
