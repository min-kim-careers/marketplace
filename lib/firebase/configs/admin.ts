import { envLoader } from '@/lib/utils/env-loader'
import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: envLoader.firebaseAdminProjectId,
      clientEmail: envLoader.firebaseAdminClientEmail,
      privateKey: envLoader.firebaseAdminPrivateKey,
    }),
  })
}

export const adminAuth = admin.auth()


