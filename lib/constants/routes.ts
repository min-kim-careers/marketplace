export const ROUTES = {
    HOME: '/',
    MARKET: '/market',
    ITEM_POST: '/item/post',
    PROFILE_UPDATE: '/profile/update',
    PROFILE_COMPLETE: '/profile/complete',
    NOTFOUND: '/404' ,
}

export const PROTECTED_ROUTES = [
    ROUTES.ITEM_POST,
    ROUTES.PROFILE_UPDATE
]

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.MARKET,
    ROUTES.NOTFOUND
]