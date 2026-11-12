import { LocationJSON } from '@/lib/utils/fuse/location-json'
import Fuse from 'fuse.js'
import data from './locations.json'

const locations = new Fuse(data, {
  keys: ['locality', 'postcode', 'state'],
  threshold: 0.3,
  useExtendedSearch: true,
})

export const searchLocations = (
  query: string,
  limit: number = 20,
): LocationJSON[] => {
  if (!query?.trim()) return []

  const results = locations
    .search(`^${query}`)
    .slice(0, limit)
    .map((result) => result.item as LocationJSON)
  return results
}

export const getLocationLabel = ({
  postcode,
  suburb,
  state,
}: {
  postcode: string
  suburb: string
  state: string
}) => {
  const result = locations.search<LocationJSON>({
    postcode,
    locality: suburb,
    state,
  })
  if (!result.length) return null
  return result[0].item.label
}
