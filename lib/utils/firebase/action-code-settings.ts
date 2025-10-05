// for signing in with email link via firebase

const appUrl = process.env.NEXT_PUBLIC_APP_URL

if (!appUrl) throw new Error('missing app url')
  
export const actionCodeSettings = {
  url: appUrl,
  handleCodeInApp: true,
}
