import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { useState } from 'react'

import LoadingDots from '@/components/loading-dots'
import { Button } from '@/components/shadcn/components/ui/button'
import { Input } from '@/components/shadcn/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/components/ui/popover'
import { SignInWithEmailLinkSchema } from '@/components/sign-in-with/email-link-button/schema'
import { actionCodeSettings } from '@/lib/utils/firebase/action-code-settings'
import { auth } from '@/lib/utils/firebase/config'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendSignInLinkToEmail } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function SignInWithEmailLinkButton() {
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof SignInWithEmailLinkSchema>>({
    resolver: zodResolver(SignInWithEmailLinkSchema),
    defaultValues: {
      email: '',
      // password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof SignInWithEmailLinkSchema>) => {
    try {
      setLoading(true)
      const { email } = values
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)
      setOpen(false)
      toast('Sign-in link sent! Check your email.')
    } catch (error) {
      console.error(error)
      toast('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Sign In with Email</Button>
      </PopoverTrigger>

      <PopoverContent side='bottom' align='end'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col'>
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
                          disabled={loading}
                          className=''
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='mt-4 w-full' disabled={loading}>
                {loading ? <LoadingDots /> : `Sign In`}
              </Button>
            </div>
          </form>
        </Form>
        A link will be sent to your email.
      </PopoverContent>
    </Popover>
  )
}
