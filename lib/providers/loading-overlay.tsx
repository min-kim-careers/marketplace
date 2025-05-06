'use client'

import LoadingOverlay from '@/components/00_common/widgets/loading-overlay'
import { useLoadingOverlayStore } from '../stores/loading-overlay'

export default function LoadingOverlayProvider() {
  const { loadingMessage } = useLoadingOverlayStore()

  return <LoadingOverlay message={loadingMessage} />
}
