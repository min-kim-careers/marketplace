import Market from '@/app/components/market'
import { useSearchParams } from 'next/navigation'

export default function MarketPage() {
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10

  return <Market page={page} limit={limit} />
}
