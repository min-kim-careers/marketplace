import Header from '@/components/01_header'
import Footer from '@/components/03_footer'
import LoadingOverlay from '@/components/00_common/loading-overlay'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex min-h-screen flex-col gap-2 p-2'>
      <LoadingOverlay />
      <Header />
      <div className='flex w-full flex-1 flex-col items-center'>
        {children}
      </div>
      <Footer />
    </div>
  )
}
