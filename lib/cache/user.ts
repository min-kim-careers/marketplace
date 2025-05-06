import { User } from '../interfaces/users'

const key = 'user'

export const cacheProfile = (user: User) => {
  localStorage.setItem(key, JSON.stringify(user))
}

export const loadProfile = (): User | null => {
  const cached = localStorage.getItem(key)
  return cached ? JSON.parse(cached) : null
}

export const clearProfile = () => {
  localStorage.removeItem(key)
}
