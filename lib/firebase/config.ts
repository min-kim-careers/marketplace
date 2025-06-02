import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'REDACTED',
  authDomain: 'market-by-kibon.firebaseapp.com',
  projectId: 'market-by-kibon',
  storageBucket: 'market-by-kibon.firebasestorage.app',
  messagingSenderId: '746909578533',
  appId: '1:746909578533:web:c4ea77d3077c58e8aa96cc',
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
