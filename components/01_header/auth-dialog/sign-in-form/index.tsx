'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/shadcn/components/ui/button'
import { Form } from '@/components/shadcn/components/ui/form'
import { toast } from '@/components/shadcn/hooks/use-toast'
import { useLoadingOverlayStore } from '@/lib/stores/loading-overlay'
import { EmailField, PasswordField } from './fields'
import { SignInFormSchema } from './schema'
import { AuthResponse } from '@/lib/interfaces/auth/response'
import useAuthStore from '@/lib/stores/auth'

export default function SignInForm() {
  const { setLoadingMessage } = useLoadingOverlayStore()
  const { setUser } = useAuthStore()

  const onSubmit = async (
    formData: z.infer<typeof SignInFormSchema>,
  ) => {
    setLoadingMessage('Signing you in...')

    try {
      const res = await fetch('/auth', {
        method: 'POST',
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      if (!res.ok) throw new Error()

      const data: AuthResponse = await res.json()
      if (!data.success || !data.user) throw new Error()

      setUser(data.user)

      toast({
        description: `Signed in successfully.`,
      })
    } catch (err) {
      toast({
        description: `Failed to sign in.`,
      })
    } finally {
      setLoadingMessage(null)
    }
  }

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <div className='flex flex-col gap-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4 text-lg'>
            <EmailField form={form} />
            <PasswordField form={form} />

            <Button type='submit' className='mt-2 w-full'>
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
