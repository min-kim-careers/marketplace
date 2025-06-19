import { ItemFormSchema } from '@/components/02_main/item/form'
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
  form: UseFormReturn<z.infer<typeof ItemFormSchema>>
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

  if (!watcher[index])
    return (
      <Label className='flex cursor-pointer items-center justify-center rounded bg-gray-200 text-gray-400'>
        <Input
          type='file'
          accept='image/x'
          onChange={handleFileChange}
          className='hidden'
        />
        <Plus />
      </Label>
    )

  return (
    <div className='relative rounded bg-gray-200'>
      <div className='relative h-full'>
        <Image
          src={watcher[index]}
          alt='Failed to load'
          layout='fill'
          objectFit='contain'
          className='flex items-center justify-center rounded text-gray-400'
        />
      </div>
      <button type='button' onClick={handleDelete}>
        <Trash className='absolute bottom-0 right-0 z-50 m-1 cursor-pointer fill-gray-100 hover:scale-110 active:scale-90' />
      </button>
    </div>
  )
}

export default function ImageField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ItemFormSchema>>
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
            <div className='grid h-[20vh] grid-cols-3 gap-2'>
              {form.watch(name).map((_, i) => (
                <ImageInput form={form} index={i} key={i} />
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
