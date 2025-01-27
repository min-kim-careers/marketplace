import Market from '@/components/market'

const DEFAULT_LIMIT = 9

export default function HomePage() {
  const params = {
    page: 1,
    limit: DEFAULT_LIMIT,
  }

  return <Market params={params}/>
}
