import Reauth from '@/components/02_content/reauth'
import { APP_ROUTES } from '@/lib/constants/app-routes'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    redirect?: string
  }>
}) {
  const next = (await searchParams).redirect || APP_ROUTES.HOME.href

  return <Reauth next={next} />
}
