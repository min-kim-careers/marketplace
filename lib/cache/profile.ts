import { User } from '../interfaces/user'

const profileKey = 'profile'

export const cacheProfile = (profile: User) => {
  localStorage.setItem(profileKey, JSON.stringify(profile))
}

export const loadProfile = (): User | null => {
  const cached = localStorage.getItem(profileKey)
  return cached ? JSON.parse(cached) : null
}

export const clearProfile = () => {
  localStorage.removeItem(profileKey)
}
