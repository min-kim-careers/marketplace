import Header from '@/components/header'
import Footer from '@/components/footer'
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
          <div className='flex min-h-screen flex-col items-center py-2 gap-2'>
            <Header />
            {children}
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </LoadingProvider>
  )
}
