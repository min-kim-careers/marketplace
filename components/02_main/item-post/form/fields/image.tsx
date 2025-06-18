import { ItemPostFormSchema } from '@/components/02_main/item-post/form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { Label } from '@/components/shadcn/components/ui/label'
import { Plus, Trash } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

const ImageInput = ({
  form,
  index,
}: {
  form: UseFormReturn<z.infer<typeof ItemPostFormSchema>>
  index: number
}) => {
  const name = 'imageUrls'

  const watcher = form.watch(name)

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const newUrls = [...watcher]
      newUrls[index] = url
      form.setValue(name, newUrls, { shouldValidate: true })
    }
  }

  const handleDelete = () => {
    const newUrls = [...watcher]
    newUrls[index] = null
    form.setValue(name, newUrls, { shouldValidate: true })
  }

  return (
    <Label className='relative flex aspect-square w-full max-w-48 cursor-pointer items-center justify-center rounded bg-gray-300 text-gray-400 shadow-sm'>
      <Input
        type='file'
        accept='image/x'
        onChange={(e) => handleFileChange(e)}
        className='hidden'
      />
      {watcher[index] ? (
        <div>
          <Image
            src={watcher[index]}
            alt='preview-image'
            layout='fill'
            objectFit='contain'
            className='rounded'
          />
          <button type='button' onClick={handleDelete}>
            <Trash className='absolute bottom-0 right-0 z-50 m-1 cursor-pointer fill-gray-100 hover:scale-110 active:scale-90' />
          </button>
        </div>
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
  const name = 'imageUrls'
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
              {form.watch(name).map((_, i) => (
                <div
                  key={i}
                  className='flex items-center justify-center'
                >
                  <ImageInput form={form} index={i} />
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
