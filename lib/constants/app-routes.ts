interface AppRoute {
  url: string
  label: string
}

export const APP_ROUTES = {
  HOME: { url: '/', label: 'Home' },
  MARKET: { url: '/market', label: 'Market' },

  ITEM_POST: { url: '/item/post', label: 'Post' },
  ITEM_EDIT: { url: '/item/edit', label: 'Edit' },

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

  NOTFOUND: { url: '/404', label: 'Not Found' },
}

const PROTECTED_ROUTES = [
  APP_ROUTES.ITEM_POST.url,
  APP_ROUTES.ITEM_EDIT.url,
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
  PROTECTED_ROUTES.some((route) => path.startsWith(route))

export const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.includes(path)

export const isFallbackRoute = (path: string) =>
  FALLBACK_ROUTES.includes(path)

export const getPathLabel = (path: string) => {
  const route = Object.values(APP_ROUTES).find((r) =>
    path.startsWith(r.url),
  )
  if (!route) throw new Error('Route not found')
  return route.label
}
