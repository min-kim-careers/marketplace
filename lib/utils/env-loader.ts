import 'server-only'

interface EnvLoader {
  apiUrl: string
  apiKey: string
  apiKeyHeader: string

  authUrl: string
  authKey: string
  authKeyHeader: string

  chatUrl: string
}

export const envLoader: EnvLoader = {
  apiUrl: process.env.API_URL!,
  apiKey: process.env.API_KEY!,
  apiKeyHeader: process.env.API_KEY_HEADER!,

  authUrl: process.env.AUTH_URL!,
  authKey: process.env.AUTH_KEY!,
  authKeyHeader: process.env.AUTH_KEY_HEADER!,

  chatUrl: process.env.CHAT_URL!,
}

const validateEnv = (env: EnvLoader) => {
  const missing = Object.entries(env).filter(([_, v]) => !v)
  if (missing.length)
    throw new Error(
      `Missing env vars: ${missing.map(([k]) => k).join(', ')}`,
    )
}

validateEnv(envLoader)
