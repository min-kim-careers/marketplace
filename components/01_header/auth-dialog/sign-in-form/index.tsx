'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/shadcn/components/ui/button'
import { Form } from '@/components/shadcn/components/ui/form'
import { EmailField, PasswordField } from './fields'
import { LoginFormSchema } from './schema'
import { toast } from '@/components/shadcn/hooks/use-toast'
import { useLoadingOverlayStore } from '@/lib/stores/loading-overlay'
import { signIn } from '@/lib/api/auth/service'
import { useRouter } from 'next/navigation'
import { PATHNAMES } from '@/lib/constants/pathnames'

export default function SignInForm() {
  const { setLoadingMessage } = useLoadingOverlayStore()
  const router = useRouter()

  const onSubmit = async (
    formData: z.infer<typeof LoginFormSchema>,
  ) => {
    setLoadingMessage('Signing you in...')
    try {
      const { success } = await signIn(
        formData.email,
        formData.password,
      )

      if (!success) throw Error()

      toast({
        description: `Signed in successfully.`,
      })
      router.replace(PATHNAMES.HOME)
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
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
