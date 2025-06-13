import '@/app/globals.css'
import { Toaster } from '@/components/shadcn/components/ui/toaster'
import { APP_DATA } from '@/lib/constants/app-data'
import FirebaseAuthListener from '@/lib/firebase/listener'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: APP_DATA.TITLE,
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
        <div className='font-[family-name:var(--font-geist-sans)]'>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
