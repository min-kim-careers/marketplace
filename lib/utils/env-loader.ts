interface EnvLoader {
  chatWs: string
  gatewayUrl: string
  sessionHeader: string
}

export const envLoader: EnvLoader = {
  chatWs: process.env.NEXT_PUBLIC_CHAT_WS!,
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL!,
  sessionHeader: process.env.NEXT_PUBLIC_SESSION_HEADER!,
}

const validateEnv = (env: EnvLoader) => {
  const missing = Object.entries(env).filter(([_, v]) => !v)
  if (missing.length)
    throw new Error(`Missing env vars: ${missing.map(([k]) => k).join(', ')}`)
}

validateEnv(envLoader)
