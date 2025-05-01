'use client'

import LoadingOverlay from '@/components/ui/loading-overlay'
import { useLoadingStore } from '../stores/loading'

export default function LoadingProvider() {
  const { loading, message } = useLoadingStore()

  return <LoadingOverlay show={loading} message={message} />
}
