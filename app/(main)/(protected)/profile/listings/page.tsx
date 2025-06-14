'use server'

import { getListings } from '@/_gateway/api/profile/service'
import ProfileListings from '@/components/02_main/protected/profile/listings'

export default async function Page() {
  const listings = await getListings()

  return <ProfileListings listings={listings}/>
}
