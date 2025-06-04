import Header from '@/components/01_header'
import Footer from '@/components/03_footer'
import { Toaster } from '@/components/shadcn/components/ui/toaster'
import LoadingProvider from '@/lib/provider/loading'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LoadingProvider>
        <div className='flex min-h-screen flex-col p-2 font-[family-name:var(--font-geist-sans)]'>

      <Header />
      <div className='flex w-full flex-1 flex-col items-center'>
        {children}
      </div>
      <Footer />
      <Toaster />
      </div>
    </LoadingProvider>
  )
}
