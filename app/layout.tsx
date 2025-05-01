import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/globals.css'
import { Toaster } from '@/components/shadcn/components/ui/toaster'
import Header from '@/components/01_header'
import Footer from '@/components/03_footer'
import AuthProvider from '@/lib/providers/auth'
import { APP_TITLE } from '@/lib/constants'
import LoadingProvider from '@/lib/providers/loading'

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
        <AuthProvider />
        <LoadingProvider/>
        <div className='flex flex-col font-[family-name:var(--font-geist-sans)] p-2'>
          <Header />
          <div className='flex min-h-screen w-full flex-1 flex-col items-center'>
            {children}
          </div>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
