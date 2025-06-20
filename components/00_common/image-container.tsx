import Image from 'next/image'

export default function ImageContainer({
  url,
}: {
  url: string
}) {
  return (
    <Image
      src={url}
      alt='Failed to load'
      layout='fill'
      objectFit='contain'
      className='flex items-center justify-center text-gray-300'
    />
  )
}
