interface EnvLoader {
  apiUrl: string
  apiKey: string
  apiKeyHeader: string

  firebaseUrl: string
  firebaseKey: string
  firebaseKeyHeader: string

  UuidNamespace: string
}

export const envLoader: EnvLoader = {
  apiUrl: process.env.API_URL!,
  apiKey: process.env.API_KEY!,
  apiKeyHeader: process.env.API_KEY_HEADER!,

  firebaseUrl: process.env.FIREBASE_URL!,
  firebaseKey: process.env.FIREBASE_KEY!,
  firebaseKeyHeader: process.env.FIREBASE_KEY_HEADER!,

  UuidNamespace: process.env.UUID_NAMESPACE!,
}

const validateEnv = (env: EnvLoader) => {
  const missing = Object.entries(env).filter(([_, v]) => !v)
  if (missing.length)
    throw new Error(
      `Missing env vars: ${missing.map(([k]) => k).join(', ')}`,
    )
}

validateEnv(envLoader)
