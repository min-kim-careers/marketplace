import Fuse from 'fuse.js'
import data from './locations.json'
import { Location } from '@/lib/utils/fuse/location'
import { logError } from '@/lib/utils/log'

const locations = new Fuse(data, {
  keys: ['locality', 'postcode', 'state'],
  threshold: 0.3,
  useExtendedSearch: true,
})

export const searchLocations = (
  query: string,
  limit: number = 20,
): Location[] => {
  if (!query?.trim()) return []

  const results = locations
    .search(`^${query}`)
    .slice(0, limit)
    .map((result) => result.item as Location)
  return results
}

export const locationExistsByPostcode = (
  postcode: string,
) => {
  const result = locations.search({ postcode })
  return result.length > 0
}
