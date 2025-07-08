import { formatDistanceToNow } from 'date-fns'

const oneDayInMs = 24 * 60 * 60 * 1000

export const formatDateFrom = (date: Date) => {
  const now = new Date()
  const diffInMs = now.getTime() - new Date(date).getTime()

  if (diffInMs < oneDayInMs && diffInMs > 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return formatDistanceToNow(date.toLocaleString(), {
    addSuffix: true,
  })
}
