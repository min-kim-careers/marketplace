export default function NotificationCountBadge({ count }: { count: number }) {
  if (count === 0) return null
  const text = count > 99 ? '99+' : count.toString()
  return (
    <span className='absolute right-1 top-1 rounded-full bg-red-500 px-1 text-xs font-bold text-blue-100'>
      {text}
    </span>
  )
}
