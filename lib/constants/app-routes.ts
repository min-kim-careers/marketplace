interface AppRoute {
  url: string
  label: string
}

export const APP_ROUTES = {
  HOME: { href: '/', label: 'Home' },
  MARKET: { href: '/market', label: 'Market' },

  ITEM_POST: { href: '/item/post', label: 'Post' },
  ITEM_EDIT: { href: '/item/edit', label: 'Edit' },

  PROFILE_DASHBOARD: {
    href: '/profile/dashboard',
    label: 'Profile Dashboard',
  },
  PROFILE_COMPLETE: {
    href: '/profile/complete',
    label: 'Complete Profile',
  },
  PROFILE_LISTINGS: {
    href: '/profile/listings',
    label: 'My Listings',
  },

  CHAT: {
    href: '/chat',
    label: 'Chat',
  },

  NOTFOUND: { href: '/404', label: 'Not Found' },
}

const PROTECTED_ROUTES = [
  APP_ROUTES.ITEM_POST.href,
  APP_ROUTES.ITEM_EDIT.href,
  APP_ROUTES.PROFILE_DASHBOARD.href,
  APP_ROUTES.PROFILE_COMPLETE.href,
  APP_ROUTES.PROFILE_LISTINGS.href,
  APP_ROUTES.CHAT.href,
]

const PUBLIC_ROUTES = [
  APP_ROUTES.HOME.href,
  APP_ROUTES.MARKET.href,
  APP_ROUTES.NOTFOUND.href,
]

const validateRoutes = () => {
  const allRoutes = [...PROTECTED_ROUTES, ...PUBLIC_ROUTES]
  const routesValues = Object.values(APP_ROUTES).map(
    (r) => r.href,
  )
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

const FALLBACK_ROUTES = [APP_ROUTES.NOTFOUND.href]

export const isProtectedRoute = (path: string) =>
  PROTECTED_ROUTES.some((route) => path.startsWith(route))

export const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.includes(path)

export const isFallbackRoute = (path: string) =>
  FALLBACK_ROUTES.includes(path)

export const getPathLabel = (path: string) => {
  const splitPath = path.split('/')
  const route = Object.values(APP_ROUTES).find((r) => {
    const splitHref = r.href.split('/')
    return splitHref.every((h, i) => splitPath[i] === h)
  })
  if (!route) throw new Error('Route not found')
  return route.label
}
