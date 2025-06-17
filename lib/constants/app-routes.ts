interface AppRoute {
  url: string
  label: string
}

export const APP_ROUTES: Record<string, AppRoute> = {
  HOME: { url: '/', label: 'Home' },
  MARKET: { url: '/market', label: 'Market' },
  NOTFOUND: { url: '/404', label: 'Not Found' },
  POST: { url: '/post', label: 'Post' },
  PROFILE_UPDATE: {
    url: '/profile/update',
    label: 'Update Profile',
  },
  PROFILE_COMPLETE: {
    url: '/profile/complete',
    label: 'Complete Profile',
  },
  PROFILE_LISTINGS: {
    url: '/profile/listings',
    label: 'My Listings',
  },
}

const PROTECTED_ROUTES = [
  APP_ROUTES.POST.url,
  APP_ROUTES.PROFILE_UPDATE.url,
  APP_ROUTES.PROFILE_COMPLETE.url,
  APP_ROUTES.PROFILE_LISTINGS.url,
]

const PUBLIC_ROUTES = [
  APP_ROUTES.HOME.url,
  APP_ROUTES.MARKET.url,
  APP_ROUTES.NOTFOUND.url,
]

const validateRoutes = () => {
  const allRoutes = [...PROTECTED_ROUTES, ...PUBLIC_ROUTES]
  const routesValues = Object.values(APP_ROUTES).map(
    (r) => r.url,
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

const FALLBACK_ROUTES = [APP_ROUTES.NOTFOUND.url]

export const isProtectedRoute = (path: string) =>
  PROTECTED_ROUTES.includes(path)

export const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.includes(path)

export const isFallbackRoute = (path: string) =>
  FALLBACK_ROUTES.includes(path)

export const getPathLabel = (pathname: string) =>
  Object.values(APP_ROUTES).filter(
    (r) => r.url === pathname,
  )[0].label
