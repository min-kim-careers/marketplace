export const ROUTES = {
  HOME: '/',
  MARKET: '/market',
  NOTFOUND: '/404',

  POST: '/post',
  PROFILE_UPDATE: '/profile/update',
  PROFILE_COMPLETE: '/profile/complete',
  PROFILE_LISTINGS: '/profile/listings',
}

const PROTECTED_ROUTES = [
  ROUTES.POST,
  ROUTES.PROFILE_UPDATE,
  ROUTES.PROFILE_COMPLETE,
  ROUTES.PROFILE_LISTINGS,
]

const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.MARKET,
  ROUTES.NOTFOUND,
]

const validateRoutes = () => {
  const allRoutes = [...PROTECTED_ROUTES, ...PUBLIC_ROUTES]
  const routesValues = Object.values(ROUTES)
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

const FALLBACK_ROUTES = [ROUTES.NOTFOUND]

export const isProtectedRoute = (path: string) =>
  PROTECTED_ROUTES.includes(path)

export const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.includes(path)

export const isFallbackRoute = (path: string) =>
  FALLBACK_ROUTES.includes(path)
