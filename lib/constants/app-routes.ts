export const APP_ROUTES = {
  HOME: '/',
  MARKET: '/market',
  NOTFOUND: '/404',

  POST: '/post',
  PROFILE_UPDATE: '/profile/update',
  PROFILE_COMPLETE: '/profile/complete',
  PROFILE_LISTINGS: '/profile/listings',
}

const PROTECTED_ROUTES = [
  APP_ROUTES.POST,
  APP_ROUTES.PROFILE_UPDATE,
  APP_ROUTES.PROFILE_COMPLETE,
  APP_ROUTES.PROFILE_LISTINGS,
]

const PUBLIC_ROUTES = [
  APP_ROUTES.HOME,
  APP_ROUTES.MARKET,
  APP_ROUTES.NOTFOUND,
]

const validateRoutes = () => {
  const allRoutes = [...PROTECTED_ROUTES, ...PUBLIC_ROUTES]
  const routesValues = Object.values(APP_ROUTES)
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

const FALLBACK_ROUTES = [APP_ROUTES.NOTFOUND]

export const isProtectedRoute = (path: string) =>
  PROTECTED_ROUTES.includes(path)

export const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.includes(path)

export const isFallbackRoute = (path: string) =>
  FALLBACK_ROUTES.includes(path)
