import '@/app/globals.css'
import { Toaster } from '@/components/shadcn/components/ui/toaster'
import { META } from '@/lib/constants/meta'
import FirebaseAuthListener from '@/lib/firebase/listener'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: META.APP_TITLE,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>
        <FirebaseAuthListener />
        <div className='flex min-h-screen flex-col p-2 font-[family-name:var(--font-geist-sans)]'>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
