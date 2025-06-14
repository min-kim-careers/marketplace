import Spinner from '@/components/00_common/spinner'
import { ItemPostFormSchema } from '@/components/02_main/protected/item/post/form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { Label } from '@/components/shadcn/components/ui/label'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { compressFile } from '@/lib/common/utils'
import { Plus, Trash } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

const ImageInput = ({
  form,
  index,
}: {
  form: UseFormReturn<z.infer<typeof ItemPostFormSchema>>
  index: number
}) => {
  const name = 'images'

  const { toast } = useToast()

  const watcher = form.watch(name)

  const [imageUrl, setImageUrl] = useState<string | null>(
    null,
  )
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setLoading(true)
      const img = e.target.files?.[0] || null
      if (!img) throw new Error()

      const compressed = await compressFile(img)
      console.log(compressed)

      const newImages = [...watcher]
      newImages[index] = compressed
      form.setValue(name, newImages, {
        shouldValidate: true,
      })
      setImageUrl(URL.createObjectURL(compressed))
    } catch (error) {
      toast({
        description:
          'Failed to load image. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (index: number) => {
    try {
      if (imageUrl) {
        const newImages = [...watcher]
        newImages[index] = null
        form.setValue(name, newImages, {
          shouldValidate: true,
        })
        URL.revokeObjectURL(imageUrl)
        setImageUrl(null)
      }
    } catch (error) {
      toast({
        description:
          'Something went wrong.',
      })
    }
  }

  return (
    <Label className='relative flex aspect-square max-w-[150px] cursor-pointer items-center justify-center rounded bg-gray-300 text-gray-400 shadow-sm'>
      <Input
        type='file'
        accept='image/x'
        onChange={(e) => handleFileChange(e)}
        className='hidden'
      />
      {imageUrl ? (
        <div>
          <Image
            src={imageUrl}
            alt='preview-image'
            layout='fill'
            objectFit='contain'
            className='rounded'
          />
          <button
            type='button'
            onClick={() => handleDelete(index)}
          >
            <Trash className='absolute bottom-0 right-0 z-50 m-1 cursor-pointer fill-gray-100 hover:scale-110 active:scale-90' />
          </button>
        </div>
      ) : loading ? (
        <Spinner />
      ) : (
        <Plus className='flex h-1/4 w-1/4 flex-1' />
      )}
    </Label>
  )
}

export default function ImageField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ItemPostFormSchema>>
}) {
  const name = 'images'
  const label = 'Images'

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='grid grid-cols-3 gap-2'>
              {form.watch(name).map((_, index) => (
                <div key={index} className='w-full'>
                  <ImageInput form={form} index={index} />
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
