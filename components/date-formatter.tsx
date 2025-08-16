'use client'
import { formatDate } from '@/lib/helpers/format-date'
import { useEffect, useState } from 'react'

export default function DateFormatter({ date }: { date: string }) {
  const [formatted, setFormatted] = useState<string | null>(null)

  useEffect(() => setFormatted(formatDate(date)), [date])

  return <span>{formatted ?? '...'}</span>
}
