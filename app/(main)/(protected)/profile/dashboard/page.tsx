export const dynamic = 'force-dynamic'

import { getProfileDashboardConstraints } from '@/api'
import ProfileDashboard from '@/app/(main)/(protected)/profile/dashboard'

export default async function Page() {
  const constraints = await getProfileDashboardConstraints()
  if (!constraints) throw new Error('Something went wrong...')

  return <ProfileDashboard constraints={constraints} />
}
