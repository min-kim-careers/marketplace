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

export interface UserCreate extends User {
    password: string
}