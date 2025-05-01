// Add environment variables here
interface Env {
  serverUrl: string
}

export const env: Env = {
  // serverUrl: process.env.SERVER_URL!,
  serverUrl: 'http://marketplace-server-service:8000',
}
