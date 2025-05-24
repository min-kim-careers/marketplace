interface Env {
  apiUrl: string
  authUrl: string
  apiKey: string
  apiKeyHeader: string
  authKey: string
  authKeyHeader: string
}

export const env: Env = {
  apiUrl: process.env.API_URL!,
  authUrl: process.env.AUTH_URL!,
  apiKey: process.env.API_KEY!,
  authKey: process.env.AUTH_KEY!,
  apiKeyHeader: process.env.API_KEY_HEADER!,
  authKeyHeader: process.env.AUTH_KEY_HEADER!,
}

const validateEnv = (env: Env) => {
  const missing = Object.entries(env).filter(([_, v]) => !v)
  if (missing.length)
    throw new Error(
      `Missing env vars: ${missing.map(([k]) => k).join(', ')}`,
    )
}

validateEnv(env)
