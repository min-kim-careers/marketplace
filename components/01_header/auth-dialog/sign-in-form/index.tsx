'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/shadcn/components/ui/button'
import { Form } from '@/components/shadcn/components/ui/form'
import { EmailField, PasswordField } from './fields'
import { LoginFormSchema } from './schema'
import { toast } from '@/components/shadcn/hooks/use-toast'
import { useLoadingStore } from '@/lib/stores/loading'

export default function SignInForm() {
  const { setLoadingMessage } = useLoadingStore()

  const onSubmit = async () => {
    setLoadingMessage('Signing you in...')
    try {
      toast({
        description: `Signed in successfully.`,
      })
    } catch (error) {
      toast({
        description: `Failed to sign in.`,
      })
    } finally {
      setLoadingMessage(null)
    }
  }

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
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
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
