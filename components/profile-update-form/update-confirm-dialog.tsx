import { ProfileUpdateFormSchema } from '@/components/profile-update-form/schema'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn/components/ui/alert-dialog'
import useProfileStore from '@/lib/stores/profile-store'
import { Profile } from '@/lib/types/profile'
import { ReactNode } from 'react'
import { z } from 'zod'

export default function UpdateConfirmDialog({
  children,
  newValues,
}: {
  children: ReactNode
  newValues: z.infer<typeof ProfileUpdateFormSchema>
}) {
  const { profile } = useProfileStore()

  if (!profile) return null

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation before proceeding</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
          {Object.entries(newValues).map(([k, v], i) => (
            <p key={i}>{` ${profile[k as keyof Profile]} -> ${v.value}`}</p>
          ))}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button type='submit' form='profileUpdateForm'>
              Update
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
