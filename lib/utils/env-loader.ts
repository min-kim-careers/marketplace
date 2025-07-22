import 'server-only'

interface EnvLoader {
  gatewayUrl: string
}

export const envLoader: EnvLoader = {
  gatewayUrl: process.env.GATEWAY_URL!,
}

const validateEnv = (env: EnvLoader) => {
  const missing = Object.entries(env).filter(([_, v]) => !v)
  if (missing.length)
    throw new Error(`Missing env vars: ${missing.map(([k]) => k).join(', ')}`)
}

validateEnv(envLoader)
