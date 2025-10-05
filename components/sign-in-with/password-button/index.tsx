import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { useEffect, useState } from 'react'

import { verifyChallenge } from '@/api'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/components/ui/popover'
import { SignInWithPasswordSchema } from '@/components/sign-in-with/password-button/schema'
import Turnstile from '@/components/turnstile'
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function SignInWithPasswordButton() {
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const { handleSignInWithPassword } = useAuthHandler()

  useEffect(() => {
    if (!token) return

    const getNonce = async () => {
      try {
        const nonce = await verifyChallenge(token)
        if (!nonce) throw new Error('challenge failed')
        form.setValue('nonce', nonce, { shouldValidate: true })
      } catch (error) {
        console.error(error)
      }
    }

    getNonce()
  }, [token])

  const form = useForm<z.infer<typeof SignInWithPasswordSchema>>({
    resolver: zodResolver(SignInWithPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      nonce: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof SignInWithPasswordSchema>) => {
    const { email, password, nonce } = values
    await handleSignInWithPassword(email, password, nonce)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Sign In</Button>
      </PopoverTrigger>

      <PopoverContent className='w-96' align='end'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name={'email'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Input
                        {...field}
                        id='email'
                        type={'email'}
                        placeholder={'Email*'}
                        className=''
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'password'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Input
                        {...field}
                        id='password'
                        type={'password'}
                        placeholder={'Password*'}
                        className=''
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='w-full flex justify-center items-center h-20'>
              <FormField
                control={form.control}
                name='nonce'
                render={({}) => (
                  <FormItem>
                    <Turnstile onVerify={setToken} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit' className='w-full'>
              Sign In
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
