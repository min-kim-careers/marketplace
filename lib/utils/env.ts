interface Env {
  serverUrl: string
}

export const env: Env = {
  serverUrl: process.env.SERVER_URL!,
}
