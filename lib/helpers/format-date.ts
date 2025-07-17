import { isToday, isYesterday } from 'date-fns'

export const formatDate = (d: Date) => {
  if (isToday(d)) {
    return 'Today'
  }
  if (isYesterday(d)) {
    return 'Yesterday'
  }

  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}
