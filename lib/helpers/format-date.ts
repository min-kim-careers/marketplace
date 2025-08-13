import { formatDistanceToNow } from 'date-fns'

const halfDayInMs = 12 * 60 * 60 * 1000

export const formatDate = (s: string) => {
  const now = new Date()
  const date = new Date(s)
  
  const diffInMs = now.getTime() - date.getTime()

  if (diffInMs < halfDayInMs && diffInMs > 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return formatDistanceToNow(date.toLocaleString(), {
    addSuffix: true,
  })
}