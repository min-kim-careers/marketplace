interface EnvLoader {
  gatewayUrl: string
  sessionHeader: string
}

export const envLoader: EnvLoader = {
  gatewayUrl: process.env.GATEWAY_URL!,
  sessionHeader: process.env.SESSION_HEADER!,
} as const
