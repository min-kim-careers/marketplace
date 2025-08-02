import { cn } from '@/components/shadcn/lib/utils'
import Image from 'next/legacy/image'

export default function ImageContainer({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  return (
    <Image
      src={url}
      alt='Failed to load'
      layout='fill'
      objectFit='contain'
      className={cn(
        'flex items-center justify-center text-gray-300',
        className,
      )}
    />
  )
}
