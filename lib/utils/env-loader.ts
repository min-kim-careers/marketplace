interface EnvLoader {
  apiUrl: string
  apiKey: string
  apiKeyHeader: string

  firebaseAdminProjectId: string
  firebaseAdminClientEmail: string
  firebaseAdminPrivateKey: string

  userUuidNamespace: string
}

export const envLoader: EnvLoader = {
  apiUrl: process.env.API_URL!,
  apiKey: process.env.API_KEY!,
  apiKeyHeader: process.env.API_KEY_HEADER!,

  firebaseAdminProjectId:
    process.env.FIREBASE_ADMIN_PROJECT_ID!,
  firebaseAdminClientEmail:
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
  firebaseAdminPrivateKey:
    process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(
      /\\n/g,
      '\n',
    ),

  userUuidNamespace: process.env.USER_UUID_NAMESPACE!,
}

const validateEnv = (env: EnvLoader) => {
  const missing = Object.entries(env).filter(([_, v]) => !v)
  if (missing.length)
    throw new Error(
      `Missing env vars: ${missing.map(([k]) => k).join(', ')}`,
    )
}

validateEnv(envLoader)
