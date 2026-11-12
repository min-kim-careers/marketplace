import Reauth from '@/app/(auth)/reauth'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { AuthProvider } from '@/lib/providers/auth-provider'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    redirect?: string
  }>
}) {
  const next = (await searchParams).redirect || APP_ROUTES.HOME.href

  return (
    <AuthProvider>
      <Reauth next={next} />
    </AuthProvider>
  )
}
