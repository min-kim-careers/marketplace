interface Env {
  serverUrl: string
  apiToken: string
}

export const env: Env = {
  serverUrl: process.env.SERVER_URL!,
  apiToken: process.env.API_TOKEN!,
}
