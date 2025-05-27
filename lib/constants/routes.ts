export const ROUTES = {
    HOME: '/',
    MARKET: '/market',
    POST: '/post',
    PROFILE: '/profile',
    NOTFOUND: '/404' ,
}

export const PROTECTED_ROUTES = [
    ROUTES.POST,
    ROUTES.PROFILE
]

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.MARKET,
    ROUTES.NOTFOUND
]