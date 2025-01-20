'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Input } from '@/components/shadcn/components/ui/input'
import { Label } from '@/components/shadcn/components/ui/label'
import { Textarea } from '@/components/shadcn/components/ui/textarea'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { ROUTES } from '@/constants/routes'
import { useRouter } from 'next/navigation'
// import { useToast } from '@/components/shadcn/hooks/use-toast'

export const mockItem = {
  name: 'Sample Item',
  price: '100',
  imageUrl: 'https://via.placeholder.com/150',
  category: 'Electronics',
  location: 'New York, NY',
  condition: 'New',
  description:
    'This is a sample item for testing purposes.',
}

export default function PostPage() {
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)

    const name = form.get('name') as string
    const price = form.get('price') as string
    const imageUrl = form.get('imageUrl') as string
    const category = form.get('category') as string
    const location = form.get('location') as string
    const condition = form.get('condition') as string
    const description = form.get('description') as string

    // if (
    //   !name ||
    //   !price ||
    //   !imageUrl ||
    //   !category ||
    //   !location ||
    //   !condition ||
    //   !description
    // ) {
    //   console.log(
    //     'Name, price, imageUrl, category, location, condition, and description are required',
    //   )
    //   toast({
    //     description:
    //       'Name, price, image url, category, location, condition, and description are required',
    //   })
    //   return
    // }

    console.log('Post ad:', {
      name,
      price,
      imageUrl,
      category,
      location,
      condition,
      description,
    })

    console.log('Mock item:', mockItem)

    // router.push(ROUTES.MARKET)
  }

  const gridStyle = 'grid grid-cols-3 items-center gap-2'
  const labelStyle = 'col-span-1'
  const inputStyle = 'col-span-2'

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>
          Post Your Ad
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4'>
            <div className={gridStyle}>
              <Label className={labelStyle} htmlFor='name'>
                Name
              </Label>
              <Input
                className={inputStyle}
                id='name'
                type='text'
                name='name'
              />
            </div>

            <div className={gridStyle}>
              <Label className={labelStyle} htmlFor='price'>
                Price
              </Label>
              <Input
                className={inputStyle}
                id='price'
                type='number'
                name='price'
              />
            </div>
            <div className={gridStyle}>
              <Label
                className={labelStyle}
                htmlFor='imageUrl'
              >
                Image URL
              </Label>
              <Input
                className={inputStyle}
                id='imageUrl'
                type='url'
                name='imageUrl'
              />
            </div>
            <div className={gridStyle}>
              <Label
                className={labelStyle}
                htmlFor='category'
              >
                Category
              </Label>
              <Input
                className={inputStyle}
                id='category'
                type='text'
                name='category'
              />
            </div>
            <div className={gridStyle}>
              <Label
                className={labelStyle}
                htmlFor='location'
              >
                Location
              </Label>
              <Input
                className={inputStyle}
                id='location'
                type='text'
                name='location'
              />
            </div>
            <div className={gridStyle}>
              <Label
                className={labelStyle}
                htmlFor='condition'
              >
                Condition
              </Label>
              <Input
                className={inputStyle}
                id='condition'
                type='text'
                name='condition'
              />
            </div>

            <div className={gridStyle}>
              <Label
                className={labelStyle}
                htmlFor='description'
              >
                Description
              </Label>
              <Textarea
                className={inputStyle}
                id='description'
                name='description'
              />
            </div>
            <Button type='submit' className='mt-2 w-full'>
              Post Ad
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
