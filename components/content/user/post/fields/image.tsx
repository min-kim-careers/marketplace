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
import Image from 'next/image'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { PostFormSchema } from '../schema'

export default function ImageField({
  form,
  imageUrls,
  setImageUrls,
}: {
  form: UseFormReturn<z.infer<typeof PostFormSchema>>
  imageUrls: string[]
  setImageUrls: Dispatch<SetStateAction<string[]>>
}) {
  const name = 'image_urls'
  const label = 'Images'
  const { toast } = useToast()

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      const newImageUrls = [...imageUrls]
      newImageUrls[index] = imageUrl
      setImageUrls(newImageUrls)
      // form.setValue(name, [imageUrl], {
      //   shouldValidate: true,
      // })
    } else {
      toast({
        description:
          'Failed to load image. Please try again.',
      })
    }
  }

  const renderInput = (index: number) => {
    return (
      <div key={index}>
        <Label className='relative flex aspect-square w-[150px] cursor-pointer items-center justify-center rounded bg-gray-300 text-gray-400 shadow-sm'>
          <Input
            type='file'
            accept='image/x'
            onChange={(e) => handleFileChange(e, index)}
            className='hidden'
          />
          {imageUrls[index] ? (
            <Image
              src={imageUrls[index]}
              alt='preview-image'
              layout='fill'
              objectFit='contain'
            />
          ) : (
            '+'
          )}
        </Label>
      </div>
    )
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='flex gap-2'>
              {imageUrls.map((_, i) =>
                renderInput(i),
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
