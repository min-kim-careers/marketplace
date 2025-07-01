import { formatDistanceToNow } from "date-fns"

export const formatDateFrom = (date: Date) => {
  return formatDistanceToNow(
    date.toLocaleString(),
    {
      addSuffix: true,
    },
  )
}
