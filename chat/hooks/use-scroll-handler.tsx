'use client'
import { useEffect, useRef, useState } from 'react'

export const useScrollHandler = (mount: boolean) => {
  const ref = useRef<HTMLDivElement>(null)
  const [atTop, setAtTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        setAtTop(ref.current.scrollTop === 0)
      }
    }

    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll)
      ref.current.scrollTop = ref.current.scrollHeight
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [mount])

  return {
    ref,
    atTop,
    nudgeDown: () => {
      if (ref.current) {
        ref.current.scrollBy({
          top: 20,
          behavior: 'smooth',
        })
      }
    },
  }
}
