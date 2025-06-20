import '@/app/globals.css'
import 'sonner/dist/styles.css';
import { APP_DATA } from '@/lib/constants/app-data'
import FirebaseAuthListener from '@/lib/firebase/firebase-auth-listener'
import type { Metadata } from 'next'
import { Toaster } from 'sonner';

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
        <Toaster position='top-center'/>
      </body>
    </html>
  )
}
