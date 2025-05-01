import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "REDACTED",
  authDomain: "marketplace-by-kibon.firebaseapp.com",
  projectId: "marketplace-by-kibon",
  storageBucket: "marketplace-by-kibon.firebasestorage.app",
  messagingSenderId: "617558185574",
  appId: "1:617558185574:web:543680375dc8d29bfc3fa7"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
