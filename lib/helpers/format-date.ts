import { formatDistanceToNow } from 'date-fns'

const HALF_DAY = 12 * 60 * 60 * 1000

export const formatDate = (s: string) => {
  const date = new Date(s)
  const diff = Date.now() - date.getTime()

  if (diff > 0 && diff < HALF_DAY) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
  })
}
