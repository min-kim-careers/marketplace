export interface User {
    id?: string
    handle: string
    email: string
    rating?: number
    ratingCount?: number
    suburb?: string
    state?: string
    avatarUrl?: string
}

export interface UserCreate {
    handle: string
    email: string
    password: string
}

export interface UserAuth {
    email: string
    password: string
}