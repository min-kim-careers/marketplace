import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'

export const toPath = (path: string, query?: object) => {
  if (query) {
    path += '?' + toURLSearchParams(query).toString()
  }
  return path
}
