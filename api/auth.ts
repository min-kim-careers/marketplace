import {
  login as loginServer,
  signup as signupServer,
  logout as logoutServer,
} from '@/lib/supabase/auth/actions'
import { z } from 'zod'
import { LoginFormSchema } from '@/components/content/auth/login/schema'
import { SignupFormSchema } from '@/components/content/auth/signup/schema'
import { Profile } from '@/interfaces/profile'

interface AuthResponse {
  log: string
  profile: Profile | null
}

export const login = async (
  formData: z.infer<typeof LoginFormSchema>,
): Promise<AuthResponse> => {
  return await loginServer(formData)
}

export const signup = async (
  formData: z.infer<typeof SignupFormSchema>,
): Promise<AuthResponse> => {
  return await signupServer(formData)
}

export const logout = async (): Promise<AuthResponse> => {
  return await logoutServer()
}
