import 'server-only'

interface Env {
  apiUrl: string
  apiKey: string
  apiKeyHeader: string
  sessionHeader: string
}

export const env: Env = {
  apiUrl: process.env.API_URL!,
  apiKey: process.env.API_KEY!,
  apiKeyHeader: process.env.API_KEY_HEADER!,
  sessionHeader: process.env.SESSION_HEADER!,
} as const
