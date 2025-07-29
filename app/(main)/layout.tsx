import Header from '@/components/01_header'
import Footer from '@/components/03_footer'
import LoadingProvider from '@/lib/providers/loading-provider'
import { AuthProvider } from '@/lib/providers/auth-provider'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <div className='flex flex-col px-4'>
          <div className='flex min-h-screen flex-col items-center pb-2'>
            <Header />
            {children}
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </LoadingProvider>
  )
}
