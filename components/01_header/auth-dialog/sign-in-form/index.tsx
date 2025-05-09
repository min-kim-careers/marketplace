'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/shadcn/components/ui/button'
import { Form } from '@/components/shadcn/components/ui/form'
import { toast } from '@/components/shadcn/hooks/use-toast'
import { useOverlayStore } from '@/lib/stores/overlay'
import { EmailField, PasswordField } from './fields'
import { SignInFormSchema } from './schema'
import useAuthStore from '@/lib/stores/auth'

export default function SignInForm() {
  const { setOverlayMessage: setLoadingMessage } = useOverlayStore()
  const { signIn } = useAuthStore()

  const onSubmit = async (
    formData: z.infer<typeof SignInFormSchema>,
  ) => {
    setLoadingMessage('Signing you in...')

    if (await signIn(formData.email, formData.password)) {
      toast({
        description: `Signed in successfully.`,
      })
    } else {
      toast({
        description: `Failed to sign in.`,
      })
    }
    setLoadingMessage(null)
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
