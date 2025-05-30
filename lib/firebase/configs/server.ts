import { envLoader } from '@/lib/utils/env-loader';
import * as admin from 'firebase-admin';

// Check if Firebase Admin SDK has already been initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: envLoader.firebaseAdminProjectId,
      clientEmail: envLoader.firebaseAdminClientEmail,
      privateKey: envLoader.firebaseAdminPrivateKey
    }),
    // Optional: If you need to access Realtime Database or Storage directly
    // databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com',
    // storageBucket: '<YOUR_PROJECT_ID>.appspot.com',
  });
}

export const adminAuth = admin.auth(); // Export the auth instance