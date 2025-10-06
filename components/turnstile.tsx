import { useEffect, useRef } from 'react'

const siteKey = process.env.NEXT_PUBLIC_SITE_KEY

if (!siteKey) throw new Error('missing turnstile site key')

export default function Turnstile({
  onVerify,
  trigger
}: {
  onVerify: (token: string) => void
  trigger: boolean
}) {
  const widgetRef = useRef(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    if (scriptLoaded.current) return
    
    // eslint-disable-next-line prefer-const
    let widgetId = null
    const script = document.createElement('script')
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.turnstile && widgetRef.current) {
        const widgetId = window.turnstile.render(widgetRef.current, {
          sitekey: process.env.NEXT_PUBLIC_SITE_KEY!,
          callback: (token: string) => onVerify(token),
        })
        scriptLoaded.current = true

        return () => window.turnstile.remove(widgetId)
      }
    }
    document.body.appendChild(script)

    return () => {
      if (scriptLoaded.current && window.turnstile && widgetId) {
        window.turnstile.remove(widgetId)
      }
    }
  }, [onVerify, trigger])

  if (!trigger) return null
  return <div ref={widgetRef} id='turnstile-container' ></div>
}
