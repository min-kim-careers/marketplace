import { checkCanUpdateHandle } from '@/api'
import ProfileDashboard from '@/components/02_content/profile-dashboard'

export default async function Page() {
  const canUpdateHandle = await checkCanUpdateHandle()

  return <ProfileDashboard canUpdateHandle={canUpdateHandle} />
}
