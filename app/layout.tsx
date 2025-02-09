import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/globals.css'
import { Toaster } from '@/components/shadcn/components/ui/toaster'
import Header from '@/components/header'
import Footer from '@/components/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Marketplace',
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
        <div className='flex flex-col font-[family-name:var(--font-geist-sans)]'>
          <div className='flex min-h-screen w-full flex-col items-center'>
            <Header />
            <div className='flex w-full flex-1 px-4'>
              {children}
            </div>
          </div>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
