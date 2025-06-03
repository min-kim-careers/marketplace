export const ROUTES = {
  HOME: '/',
  MARKET: '/market',
  NOTFOUND: '/404',

  ITEM_POST: '/item/post',
  PROFILE_UPDATE: '/profile/update',
  PROFILE_COMPLETE: '/profile/complete',
}

const PROTECTED_ROUTES = [
  ROUTES.ITEM_POST,
  ROUTES.PROFILE_UPDATE,
  ROUTES.PROFILE_COMPLETE,
]

const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.MARKET,
  ROUTES.NOTFOUND,
]

const FALLBACK_ROUTES = [ROUTES.NOTFOUND]

export const isProtectedRoute = (path: string) =>
  PROTECTED_ROUTES.includes(path)

export const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.includes(path)

export const isFallbackRoute = (path: string) =>
  FALLBACK_ROUTES.includes(path)
