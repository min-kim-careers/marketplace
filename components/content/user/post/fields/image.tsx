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
import { Plus, Trash } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { PostFormSchema } from '../schema'

export default function ImageField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof PostFormSchema>>
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
      const newImageUrls = [...form.getValues().image_urls!]
      newImageUrls[index] = imageUrl
      form.setValue('image_urls', newImageUrls)
    } else {
      toast({
        description:
          'Failed to load image. Please try again.',
      })
    }
  }

  const handleDelete = (index: number) => {
    const newImageUrls = [...form.getValues().image_urls!]
    newImageUrls[index] = ''
    form.setValue('image_urls', newImageUrls)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='flex gap-2'>
              {field.value &&
                field.value.map((_, index) => (
                  <div key={index}>
                    <Label className='relative flex aspect-square w-[150px] cursor-pointer items-center justify-center rounded bg-gray-300 text-gray-400 shadow-sm'>
                      <Input
                        type='file'
                        accept='image/x'
                        onChange={(e) =>
                          handleFileChange(e, index)
                        }
                        className='hidden'
                      />
                      {field.value?.[index] ? (
                        <div>
                          <Image
                            src={field.value[index]}
                            alt='preview-image'
                            layout='fill'
                            objectFit='contain'
                          />
                          <button
                            type='button'
                            onClick={() =>
                              handleDelete(index)
                            }
                          >
                            <Trash className='absolute bottom-0 right-0 z-50 m-1 cursor-pointer text-black' />
                          </button>
                        </div>
                      ) : (
                        <Plus />
                      )}
                    </Label>
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
