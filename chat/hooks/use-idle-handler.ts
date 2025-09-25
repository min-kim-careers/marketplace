import useChatStore from '@/chat/stores/chat-store'
import { useIdleTimer } from 'react-idle-timer'

export const useIdleHandler = (token?: string) => {
  const { setUrl, setProps } = useChatStore()

  const status = useChatStore((state) => state.status)

  const {
    // start: startIdleTimer,
    reset: resetIdleTimer,
    pause: pauseIdleTimer,
  } = useIdleTimer({
    timeout: 1000 * 60 * 5, // set to idle after 5 min
    startManually: true,
    stopOnIdle: true,
    onIdle: () => {
      console.log('idling')
      setUrl()
      setProps({ status: 'idling' })
      pauseIdleTimer()
    },
    onActive: () => {
      console.log('unidling')
      setUrl(token)
      resetIdleTimer()
    },
    debounce: 500,
  })
}
