import { APP_ROUTES } from "@/lib/constants/app-routes"
import useFirebaseStore from "@/lib/stores/firebase-store"
import useLoadingStore from "@/lib/stores/loading-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const useLoadToken = () => {
  const router = useRouter()
  
  const { user, getToken } = useFirebaseStore()
  const { setLoading } = useLoadingStore()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const loadToken = async () => {
      if (!user) return
      try {
        setLoading('Loading...')
        setToken(await getToken())
      } catch (error) {
        router.replace(APP_ROUTES.NOTFOUND.href)
      } finally {
        setLoading(null)
      }
    }
    loadToken()
  }, [user])

  return token
}
