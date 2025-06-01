import { User } from '@/lib/firebase/context';
import { Tokens, getTokens } from 'next-firebase-auth-edge';
import { filterStandardClaims } from 'next-firebase-auth-edge/auth/claims';
import { cookies } from 'next/headers';


// Define your Firebase credentials (consider using environment variables for these)
const FIREBASE_CONFIG = {
  apiKey: 'REDACTED',
  cookieName: 'session',
  cookieSignatureKeys: [
    '9irYZCncgbasIjAtERea+yEFmJHaPzksKxSv09XB/H8=',
  ],
  serviceAccount: {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!, // Use process.env for security
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!, // Use process.env for security
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(
      /\\n/g,
      '\n'
    ), // Important for private key
  },
}

export const toUser = ({ decodedToken }: Tokens): User => {
  const {
    uid, email, picture: photoURL, email_verified: emailVerified, phone_number: phoneNumber, name: displayName, source_sign_in_provider: signInProvider,
  } = decodedToken

  const customClaims = filterStandardClaims(decodedToken)

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    providerId: signInProvider,
    customClaims,
  }
}

export async function getUserFromCookies(): Promise<User | null> {
  const tokens = await getTokens(
    await cookies(),
    FIREBASE_CONFIG
  )
  return tokens ? toUser(tokens) : null
}
