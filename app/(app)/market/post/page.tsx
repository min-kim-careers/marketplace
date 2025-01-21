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
import { insertItem } from '@/utils/supabase/crud/item'
// import { ROUTES } from '@/constants/routes'
// import { useRouter } from 'next/navigation'

export default function PostPage() {
  const { toast } = useToast()
  // const router = useRouter()

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

    const mockItem = {
      name: 'AMD Ryzen 9 5900X',
      description:
        '12-core, 24-thread unlocked desktop processor',
      price: 499.99,
      image_url:
        'https://example.com/amd_ryzen_9_5900x.jpg',
      category: 'CPU',
      profile_id: '0e141d61-4d0a-479d-9041-ef5062ea47fb',
      created_at: new Date(),
      updated_at: new Date(),
      location: {
        suburb: 'Melbourne',
        state: 'VIC',
      },
      condition: 'New',
    }

    await insertItem(mockItem)

    // router.push(ROUTES.MARKET)
  }

  const styles = {
    field: 'grid grid-cols-3 items-center gap-2',
    label: 'col-span-1',
    input: 'col-span-2',
  }

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
            <div className={styles.field}>
              <Label
                className={styles.label}
                htmlFor='name'
              >
                Name
              </Label>
              <Input
                className={styles.input}
                id='name'
                type='text'
                name='name'
              />
            </div>

            <div className={styles.field}>
              <Label
                className={styles.label}
                htmlFor='price'
              >
                Price
              </Label>
              <Input
                className={styles.input}
                id='price'
                type='number'
                name='price'
              />
            </div>
            <div className={styles.field}>
              <Label
                className={styles.label}
                htmlFor='imageUrl'
              >
                Image URL
              </Label>
              <Input
                className={styles.input}
                id='imageUrl'
                type='url'
                name='imageUrl'
              />
            </div>
            <div className={styles.field}>
              <Label
                className={styles.label}
                htmlFor='category'
              >
                Category
              </Label>
              <Input
                className={styles.input}
                id='category'
                type='text'
                name='category'
              />
            </div>
            <div className={styles.field}>
              <Label
                className={styles.label}
                htmlFor='location'
              >
                Location
              </Label>
              <Input
                className={styles.input}
                id='location'
                type='text'
                name='location'
              />
            </div>
            <div className={styles.field}>
              <Label
                className={styles.label}
                htmlFor='condition'
              >
                Condition
              </Label>
              <Input
                className={styles.input}
                id='condition'
                type='text'
                name='condition'
              />
            </div>

            <div className={styles.field}>
              <Label
                className={styles.label}
                htmlFor='description'
              >
                Description
              </Label>
              <Textarea
                className={styles.input}
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
