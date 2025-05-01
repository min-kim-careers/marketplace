import { Profile } from '../interfaces/profile'

const profileKey = 'profile'

export const cacheProfile = (profile: Profile) => {
  localStorage.setItem(profileKey, JSON.stringify(profile))
}

export const loadProfile = (): Profile | null => {
  const cached = localStorage.getItem(profileKey)
  return cached ? JSON.parse(cached) : null
}

export const clearProfile = () => {
  localStorage.removeItem(profileKey)
}
