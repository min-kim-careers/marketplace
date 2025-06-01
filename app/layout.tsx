import '@/app/globals.css'
import Header from '@/components/01_header'
import Footer from '@/components/03_footer'
import { Toaster } from '@/components/shadcn/components/ui/toaster'
import { APP_TITLE } from '@/lib/constants/meta'
import LoadingProvider from '@/lib/providers/loading'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: APP_TITLE,
  description:
    'A marketplace for buying and selling goods.',
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <LoadingProvider />
          <div className='flex min-h-screen flex-col p-2 font-[family-name:var(--font-geist-sans)]'>
            <Header />
            <div className='flex w-full flex-1 flex-col items-center'>
              {children}
            </div>
            <Footer />
          </div>
          <Toaster />
      </body>
    </html>
  )
}
