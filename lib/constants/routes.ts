export const ROUTES = {
    HOME: '/',
    MARKET: '/market',
    POST: '/post',
    PROFILE: '/profile'
}

export const PROTECTED_ROUTES = [
    ROUTES.POST,
    ROUTES.PROFILE
]

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.MARKET,
]