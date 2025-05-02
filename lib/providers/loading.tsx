'use client'

import LoadingOverlay from '@/components/ui/loading-overlay'
import { useLoadingStore } from '../stores/loading'

export default function LoadingProvider() {
  const { loadingMessage } = useLoadingStore()

  return <LoadingOverlay message={loadingMessage} />
}
