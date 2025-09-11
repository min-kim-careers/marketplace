import ChatProvider from '@/chat/providers/chat-provider'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { ProfileLoader } from '@/components/profile-loader'
import { AuthProvider } from '@/lib/providers/auth-provider'
import LoadingProvider from '@/lib/providers/loading-provider'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <ChatProvider>
          <ProfileLoader />
          <div className='flex flex-col px-4'>
            <div className='flex min-h-screen flex-col gap-2 py-2'>
              <Header />
              {children}
            </div>
            <Footer />
          </div>
        </ChatProvider>
      </AuthProvider>
    </LoadingProvider>
  )
}
