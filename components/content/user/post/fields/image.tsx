import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { PostFormSchema } from '../schema'
import { CldUploadWidget } from 'next-cloudinary'

export default function Image({
  form,
}: {
  form: UseFormReturn<z.infer<typeof PostFormSchema>>
}) {
  const name = 'image_urls'
  const label = 'Image'
  const images_allowed = 3
  const image_urls = Array.from(
    { length: images_allowed },
    () => '',
  )

  return (
    <div className='flex h-[100px] w-full flex-row justify-evenly'>
      {image_urls.map((url, i) => (
        <CldUploadWidget
          key={i}
          uploadPreset='<Your Upload Preset>'
        >
          {({ open }) => {
            return (
              <button
                className='flex aspect-square h-full items-center justify-center rounded bg-gray-300 text-3xl text-gray-400'
                onClick={() => open()}
              >
                +
              </button>
            )
          }}
        </CldUploadWidget>
      ))}
    </div>
  )
}
