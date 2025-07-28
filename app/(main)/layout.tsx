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
    <AuthProvider>
      <LoadingProvider>
        <div className='flex flex-col px-2'>
          <div className='flex min-h-screen flex-col items-center'>
            <Header />
            {children}
          </div>
          <Footer />
        </div>
      </LoadingProvider>
    </AuthProvider>
  )
}
