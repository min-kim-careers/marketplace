import 'server-only'

interface EnvLoader {
  apiUrl: string
  apiKey: string
  apiKeyHeader: string
  sessionHeader: string
}

export const envLoader: EnvLoader = {
  apiUrl: process.env.API_URL!,
  apiKey: process.env.API_KEY!,
  apiKeyHeader: process.env.API_KEY_HEADER!,
  sessionHeader: process.env.SESSION_HEADER!,
} as const
