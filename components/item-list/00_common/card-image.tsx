import Image from 'next/image'

export default function CardImage({
  imageUrls,
  show = true,
}: {
  imageUrls: string[]
  show: boolean
}) {
  if (!imageUrls[0] || !show) return null

  return (
    <div className='relative w-[25%] rounded-r-lg bg-gray-300'>
      <Image
        src={imageUrls[0]}
        alt='Failed to load'
        layout='fill'
        objectFit='contain'
        className='flex items-center justify-center text-gray-300'
      />
      {imageUrls.length > 1 && (
        <p className='absolute bottom-0 right-0 z-10 m-2 flex justify-end rounded bg-white px-1 py-[0.5]'>
          +{imageUrls.length - 1}
        </p>
      )}
    </div>
  )
}
