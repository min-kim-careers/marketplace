interface Env {
  apiUrl: string
  authUrl: string
  apiKey: string
  authKey: string
}

export const env: Env = {
  apiUrl: process.env.API_URL!,
  authUrl: process.env.AUTH_URL!,
  apiKey: process.env.API_KEY!,
  authKey: process.env.AUTH_KEY!,
}

const validateEnv = (env: Env) => {
  const missing = Object.entries(env).filter(([_, v]) => !v)
  if (missing.length)
    throw new Error(
      `Missing env vars: ${missing.map(([k]) => k).join(', ')}`,
    )
}

validateEnv(env)
