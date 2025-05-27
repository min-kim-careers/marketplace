'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/shadcn/components/ui/button'
import { Form } from '@/components/shadcn/components/ui/form'
import { toast } from '@/components/shadcn/hooks/use-toast'
import { gatewaySignUp } from '@/_gateway/auth/service'
import { SignupFormSchema } from '@/lib/schemas/sign-up'
import {
  EmailField,
  HandleField,
  PasswordField,
} from '@/lib/schemas/sign-up/fields'
import { useOverlayStore } from '@/lib/stores/overlay'
import { SignUpClientResponse } from '@/_gateway/auth/responses'

export default function SignupForm() {
  const { setOverlayMessage: setLoadingMessage } =
    useOverlayStore()

  const onSubmit = async (
    formData: z.infer<typeof SignupFormSchema>,
  ): Promise<void> => {
    setLoadingMessage('Signing you up...')
    try {
      const { success }: SignUpClientResponse = await gatewaySignUp(
        formData.email,
        formData.password,
        formData.handle,
      )
      if (!success) throw new Error()

      toast({
        description: `Signed up successfully.`,
      })
    } catch (error) {
      toast({
        description: (error as Error).message ?? 'Something went wrong',
      })
    } finally {
      setLoadingMessage(null)
    }
  }

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      handle: '',
      email: '',
      password: '',
    },
  })

  return (
    <div className='flex flex-col gap-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <EmailField form={form} />
            <PasswordField form={form} />
            <HandleField form={form} />

            <Button type='submit' className='mt-2 w-full'>
              Sign Up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
