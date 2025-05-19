interface Env {
  serverUrl: string
  apiKey: string
}

export const env: Env = {
  serverUrl: process.env.SERVER_URL!,
  apiKey: process.env.API_KEY!,
}

const validateEnv = (env: Env) => {
  const missing = Object.entries(env).filter(([_, v]) => !v)
  if (missing.length)
    throw new Error(
      `Missing env vars: ${missing.map(([k]) => k).join(', ')}`,
    )
}

validateEnv(env)
