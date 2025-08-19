import Chat from '@/components/chat'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { AuthProvider } from '@/lib/providers/auth-provider'
import { ChatProvider } from '@/lib/providers/chat-provider'
import LoadingProvider from '@/lib/providers/loading-provider'
import { ProfileLoader } from '@/components/profile-loader'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <ProfileLoader />
          <ChatProvider>
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
