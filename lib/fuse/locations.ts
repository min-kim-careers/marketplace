import Fuse from 'fuse.js'
import data from './locations.json'

const locations = new Fuse(data, {
  keys: ['locality'],
  threshold: 0.3,
  useExtendedSearch: true
})

export const searchLocations = async (
  query: string,
  limit: number = 20,
): Promise<string[]> => {
  return new Promise((resolve) => {
    const results = locations
      .search(`^${query}`)
      .slice(0, limit)
      .map((result) => result.item.label)
    resolve(results)
  })
}

export const checkLocationExists = (value: string) => {
  const result = locations.search(value)
  return result.length > 0
}
