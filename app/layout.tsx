import '@/app/globals.css'
import { APP_TITLE } from '@/lib/constants/meta'
import FirebaseController from '@/lib/firebase/controller'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  display: 'swap',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: APP_TITLE,
  description:
    'A marketplace for buying and selling goods.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FirebaseController />
        <div className='flex min-h-screen flex-col p-2 font-[family-name:var(--font-geist-sans)]'>
          {children}
        </div>
      </body>
    </html>
  )
}
