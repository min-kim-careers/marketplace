import useChatStore from '@/chat/stores/chat-store'
import { useEffect } from 'react'
import { useIdleTimer } from 'react-idle-timer'

export const useIdleHandler = (token?: string) => {
  const { setUrl, setProps } = useChatStore()

  const status = useChatStore((state) => state.status)

  useEffect(() => {
    if (status === 'connected') {
      startIdleTimer()
    } else if (status === 'disconnected') {
      pauseIdleTimer()
    }
  }, [status])

  const {
    start: startIdleTimer,
    reset: resetIdleTimer,
    pause: pauseIdleTimer,
  } = useIdleTimer({
    timeout: 1000 * 5, // set to idle after 5 min
    // timeout: 1000 * 60 * 5, // set to idle after 5 min
    startManually: true,
    onIdle: () => {
      // console.log('idling')
      setUrl()
      setProps({ status: 'idling' })
    },
    onActive: () => {
      // console.log('unidling')
      setUrl(token)
    },
    debounce: 500,
  })
}
