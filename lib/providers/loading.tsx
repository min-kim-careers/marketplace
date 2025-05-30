'use client'

import LoadingOverlay from '@/components/00_common/loading-overlay'
import { useLoadingStore } from '../stores/loading'

export default function LoadingProvider() {
  const { message } = useLoadingStore()

  return <LoadingOverlay message={message} />
}
