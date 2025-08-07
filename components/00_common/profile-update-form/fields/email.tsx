import { z } from 'zod'

import { profileEmailExists } from '@/api'
import LoadingDots from '@/components/00_common/loading-dots'
import Spinner from '@/components/00_common/spinner'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import useProfileStore from '@/lib/stores/profile-store'
import { CheckCheck, X } from 'lucide-react'
import { ChangeEvent, MouseEvent, ReactNode, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ProfileUpdateFormSchema } from '@/components/00_common/profile-update-form/schema'

const DefaultButtonNode = () => <>Confirm</>
const HandleTakenButtonNode = () => <X />
const ConfirmedButtonNode = () => <CheckCheck />

export default function EmailField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ProfileUpdateFormSchema>>
}) {
  const { profile } = useProfileStore()

  if (!profile) return <LoadingDots />

  const name = 'email.value'
  const label = 'Email'
  const type = 'email'
  const placeholder = profile.email

  const [input, setInput] = useState('')
  const [buttonNode, setButtonNode] = useState<ReactNode>(<DefaultButtonNode />)

  const {
    setValue,
    setError,
    formState: { errors },
    clearErrors,
  } = form

  const [confirmed, setConfirmed] = [
    form.watch().email.confirmed,
    (c: boolean) => {
      setValue('email.confirmed', c)
    },
  ]

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (confirmed) setConfirmed(false)
    setButtonNode(<DefaultButtonNode />)

    const input = e.target.value.trim()
    setInput(input)

    const { success, error } = ProfileUpdateFormSchema.safeParse({
      'email.value': input
    })

    if (!success && error) {
      setError(name, {
        message: error.errors[0]?.message,
      })
    } else if (input === profile.email) {
      setError(name, {
        message: 'Email is unchanged',
      })
    } else {
      clearErrors(name)
    }
  }

  const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      setButtonNode(<Spinner />)

      if (await profileEmailExists(input)) {
        setButtonNode(<HandleTakenButtonNode />)
        setConfirmed(false)
        setError(name, {
          message: 'Email already taken :(',
        })
      } else {
        setButtonNode(<ConfirmedButtonNode />)
        setConfirmed(true)
      }
    } catch (error) {
      console.error('Error confirming email')
      setButtonNode(<DefaultButtonNode />)
      setConfirmed(false)
    }
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='flex items-center gap-2'>
              <Input
                {...field}
                id='email'
                type={type}
                placeholder={placeholder}
                onChange={(e) => {
                  field.onChange(e)
                  handleInputChange(e)
                }}
              />
              <Button
                className='w-[100px]'
                onClick={handleButtonClick}
                disabled={confirmed || !input || !!errors.email}
              >
                {buttonNode}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
