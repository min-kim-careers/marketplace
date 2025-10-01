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
import { ArrowRight } from 'lucide-react'
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
          <div className='space-y-4 py-2'>
            {Object.entries(newValues).map(([k, v], i) => (
              <div key={i}>
                <p className='text-sm text-muted-foreground'>
                  {k.slice(0, 1).toUpperCase() + k.slice(1)}
                </p>
                <p className='flex flex-nowrap items-center gap-2'>
                  {profile[k as keyof Profile]}
                  <span>
                    <ArrowRight className='h-4 w-4' />
                  </span>
                  {v.value}
                </p>
              </div>
            ))}
          </div>
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
