import { isInConst } from '@/lib/helpers/is-in-const'

export const APP_ROUTES = {
  HOME: { href: '/', label: 'Home' },

  REAUTH: { href: '/reauth', label: 'Auth' },

  CHAT: { href: '/chat', label: 'Chat' },

  MARKET: { href: '/market', label: 'Market' },

  ITEM_POST: { href: '/item/post', label: 'Post' },
  ITEM_EDIT: { href: '/item/edit', label: 'Edit' },

  PROFILE_DASHBOARD: {
    href: '/profile/dashboard',
    label: 'Dashboard',
  },
  PROFILE_LISTINGS: {
    href: '/profile/listings',
    label: 'Listings',
  },

  NOTFOUND: { href: '/404', label: 'Not Found' },
} as const

const PROTECTED_ROUTES = [
  APP_ROUTES.ITEM_POST.href,
  APP_ROUTES.ITEM_EDIT.href,
  APP_ROUTES.PROFILE_DASHBOARD.href,
  APP_ROUTES.PROFILE_LISTINGS.href,
  APP_ROUTES.CHAT.href,
] as const
export const isProtectedRoute = (path: string) =>
  PROTECTED_ROUTES.some((route) => path.startsWith(route))

const PUBLIC_ROUTES = [APP_ROUTES.HOME.href, APP_ROUTES.MARKET.href] as const
export const isPublicRoute = (path: string) => isInConst(path, PUBLIC_ROUTES)

const FALLBACK_ROUTES = [APP_ROUTES.NOTFOUND.href] as const
export const isFallbackRoute = (path: string) =>
  isInConst(path, FALLBACK_ROUTES)

const AUTH_ROUTES = [APP_ROUTES.REAUTH.href] as const
export const isAuthRoute = (path: string) => isInConst(path, AUTH_ROUTES)

const validateRoutes = () => {
  const allRoutes = [
    ...PROTECTED_ROUTES,
    ...PUBLIC_ROUTES,
    ...FALLBACK_ROUTES,
    ...AUTH_ROUTES,
  ]
  const routesValues = Object.values(APP_ROUTES).map((r) => r.href)
  allRoutes.forEach((route) => {
    if (!routesValues.includes(route)) {
      throw new Error(`Invalid route: ${route}`)
    }
  })
  if (allRoutes.length !== routesValues.length) {
    throw new Error(`Invalid number of routes`)
  }
}

validateRoutes()
