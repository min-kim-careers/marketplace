import { Profile } from "../interfaces/profile"

const PROFILE_KEY = 'profile'

export const saveProfile = (profile: Profile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export const loadProfile = (): Profile | null => {
  const profile = localStorage.getItem(PROFILE_KEY)
  return profile ? JSON.parse(profile) : null
}

export const clearProfile = () => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(null))
}
