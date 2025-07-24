import { isToday, isYesterday } from 'date-fns'

export const formatChatDate = (s: string) => {
  const d = new Date(s)
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
