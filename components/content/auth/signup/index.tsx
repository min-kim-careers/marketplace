'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Form } from '@/components/shadcn/components/ui/form'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { ROUTES } from '@/constants/routes'
import useAuthStore from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { Email, Handle, Password } from './fields'
import { SignupFormSchema } from './schema'

export default function Signup() {
  const { signup } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      handle: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(
    formData: z.infer<typeof SignupFormSchema>,
  ) {
    const { handle } = await signup(formData)

    if (handle) {
      router.replace(ROUTES.HOME)
      toast({
        description: `Signed up successfully. Welcome ${handle}`,
      })
    } else {
      toast({
        description: `Sign up was unsuccessful`,
      })
    }
  }

  return (
    <Card className='my-4 flex flex-col'>
      <CardHeader>
        <CardTitle className='text-2xl'>Sign Up</CardTitle>
        <CardDescription>
          Fill in the form below to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-2'>
              <Handle form={form} />
              <Email form={form} />
              <Password form={form} />

              <Button type='submit' className='w-full'>
                Sign Up
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
