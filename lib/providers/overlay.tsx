'use client'

import LoadingOverlay from '@/components/00_common/loading-overlay'
import { useOverlayStore } from '../stores/overlay'

export default function OverlayProvider() {
  const { overlayMessage } = useOverlayStore()

  return <LoadingOverlay message={overlayMessage} />
}
