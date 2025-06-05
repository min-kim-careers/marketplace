import Header from '@/components/01_header'
import Footer from '@/components/03_footer'
import LoadingProvider from '@/lib/provider/loading'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LoadingProvider>
      <Header />
      <div className='flex w-full flex-1 flex-col items-center'>
        {children}
      </div>
      <Footer />
    </LoadingProvider>
  )
}
