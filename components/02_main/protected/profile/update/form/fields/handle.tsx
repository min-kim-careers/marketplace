import { z } from 'zod'

import { serviceCheckHandleExists } from '@/_gateway/api/profile/service'
import Spinner from '@/components/00_common/spinner'
import { ProfileUpdateForm } from '@/components/02_main/protected/profile/update/form'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import useProfileStore from '@/lib/stores/profile'
import { CheckCheck, X } from 'lucide-react'
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'
import { UseFormReturn } from 'react-hook-form'

const DefaultButtonNode = () => <>Confirm</>
const HandleTakenButtonNode = () => <X />
const ConfirmedButtonNode = () => <CheckCheck />

export default function HandleField({
  confirmed,
  setConfirmed,
  form,
}: {
  confirmed: boolean
  setConfirmed: Dispatch<SetStateAction<boolean>>
  form: UseFormReturn<z.infer<typeof ProfileUpdateForm>>
}) {
  const { profile } = useProfileStore()
  const { toast } = useToast()

  const name = 'handle'
  const label = 'Handle'
  const type = 'text'
  const placeholder = profile?.handle

  const [input, setInput] = useState('')
  const [buttonNode, setButtonNode] = useState<ReactNode>(
    <DefaultButtonNode />,
  )
  const handleSchema = ProfileUpdateForm.pick({
    handle: true,
  })

  const {
    setError,
    formState: { errors },
    clearErrors,
  } = form

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault()
    if (confirmed) setConfirmed(false)
    setButtonNode(<DefaultButtonNode />)

    const newInput = e.target.value.trim()
    setInput(newInput)

    const { success, error } = handleSchema.safeParse({
      handle: newInput,
    })

    if (!success && error) {
      setError(name, {
        message: error.errors[0]?.message,
      })
    } else if (newInput === profile?.handle) {
      setError(name, {
        message: 'Handle is unchanged',
      })
    } else {
      clearErrors(name)
    }
  }

  const handleButtonClick = async (
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
    try {
      setButtonNode(<Spinner />)
      const handleExists =
        await serviceCheckHandleExists(input)

      if (handleExists) {
        setButtonNode(<HandleTakenButtonNode />)
        setConfirmed(false)
        setError(name, {
          message: 'Handle already taken :(',
        })
      } else {
        setButtonNode(<ConfirmedButtonNode />)
        setConfirmed(true)
        toast({
          description: 'Handle is available :)'
        })
      }
    } catch (error) {
      console.error('Error confirming handle')
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
                id='handle'
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
                disabled={
                  confirmed || !input || !!errors.handle
                }
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
