import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../shadcn/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../shadcn/components/ui/dialog'
import SignInForm from './sign-in-form'
import SignupForm from './sign-up-form'

export default function AuthModal({children}:{children: React.ReactNode}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className='sr-only'></DialogTitle>
        <Accordion type='single' defaultValue='sign-in'>
          <AccordionItem value='sign-in'>
            <AccordionTrigger className='flex items-center justify-center data-[state=open]:text-lg font-medium hover:no-underline'>
              Sign In
            </AccordionTrigger>
            <AccordionContent className='px-1'>
              <SignInForm />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='sign-up'
            className='border-0'
          >
            <AccordionTrigger className='flex items-center justify-center data-[state=open]:text-lg font-medium hover:no-underline'>
              Sign Up
            </AccordionTrigger>
            <AccordionContent className='px-1'>
              <SignupForm />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  )
}
