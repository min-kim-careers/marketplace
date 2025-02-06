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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { ROUTES } from '@/constants/routes'
import useAuthStore from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { signupSchema } from './schema'

export default function Signup() {
  const { actions } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      handle: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(
    values: z.infer<typeof signupSchema>,
  ) {
    const { error } = await actions.signup(
      values.email,
      values.password,
      values.handle,
    )

    if (error) {
      toast({
        description: error.message,
      })
      return
    }

    router.push(ROUTES.HOME)
    toast({
      description: 'Sign up successful',
    })
  }

  const renderInputField = (
    name: keyof z.infer<typeof signupSchema>,
    type: string,
    label: string,
    placeholder: string,
    description?: string,
  ) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2'>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
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
              {renderInputField(
                'email',
                'email',
                'Email',
                'Enter your email',
              )}
              {renderInputField(
                'password',
                'password',
                'Password',
                'Enter your password',
              )}
              {renderInputField(
                'handle',
                'text',
                'Handle',
                'Enter your handle',
              )}

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
