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
import SignInWithGoogleButton from '@/components/sign-in/google-button'
import { SignInWithPasswordSchema } from '@/components/sign-in/password-popover/schema'
import Turnstile from '@/components/turnstile'
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function SignInWithPasswordPopover() {
  const [open, setOpen] = useState(false)
  const [showTurnstile, setShowTurnstile] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [nonce, setNonce] = useState<string | null>(null)
  const { handleSignInWithPassword } = useAuthHandler()

  useEffect(() => {
    if (!token) return

    const getNonce = async () => {
      try {
        const nonce = await verifyChallenge(token)
        if (!nonce) throw new Error('challenge failed')
        setNonce(nonce)
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
    },
  })

  const handleSubmit = async (
    values: z.infer<typeof SignInWithPasswordSchema>,
  ) => {
    if (!nonce) return
    const { email, password } = values
    await handleSignInWithPassword(email, password, nonce)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Sign In</Button>
      </PopoverTrigger>

      <PopoverContent className='w-96 space-y-2' align='end'>
        <div className='font-bold pb-2 text-lg'>Get Started</div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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

            <div className='flex items-center justify-center'>
              <Turnstile onVerify={setToken} trigger={showTurnstile} />
            </div>

            {token ? (
              <Button type='submit' className='w-full'>
                Sign In / Register
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  const valid = await form.trigger(['email', 'password'])
                  if (valid) {
                    setShowTurnstile(true)
                  } else {
                    console.warn('Email or password invalid')
                  }
                }}
                disabled={showTurnstile}
              >
                Sign In / Register
              </Button>
            )}
          </form>
        </Form>

        <SignInWithGoogleButton />
      </PopoverContent>
    </Popover>
  )
}
