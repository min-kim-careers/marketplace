'use server'

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'REDACTED',
  authDomain: 'market-by-kibon.firebaseapp.com',
  projectId: 'market-by-kibon',
  storageBucket: 'market-by-kibon.firebasestorage.app',
  messagingSenderId: '746909578533',
  appId: '1:746909578533:web:c4ea77d3077c58e8aa96cc',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }
