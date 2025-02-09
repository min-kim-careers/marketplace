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
import { Email, Password } from './fields'
import { LoginFormSchema } from './schema'

export default function Signup() {
  const { login } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(
    formData: z.infer<typeof LoginFormSchema>,
  ) {
    const { handle } = await login(formData)

    if (handle) {
      router.replace(ROUTES.HOME)
      toast({
        description: `Logged in. Welcome back ${handle}`,
      })
    } else {
      toast({
        description: `Login was unsuccessful`,
      })
    }
  }

  return (
    <Card className='my-4 flex flex-col'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-4'>
              <Email form={form} />
              <Password form={form} />

              <Button type='submit' className='mt-4 w-full'>
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
