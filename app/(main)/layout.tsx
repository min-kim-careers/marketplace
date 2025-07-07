import Header from '@/components/01_header'
import Footer from '@/components/03_footer'
import LoadingOverlay from '@/components/00_common/loading-overlay'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex flex-col px-2'>
      <LoadingOverlay />
      <div className='flex flex-col items-center min-h-screen'>
        <Header />
        {children}
      </div>
      <Footer />
    </div>
  )
}
