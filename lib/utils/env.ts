// Add environment variables here
interface Env {
  serverUrl: string
  clientId: string
  clientSecret: string
}

export const env: Env = {
  serverUrl: process.env.SERVER_URL!,
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
}
