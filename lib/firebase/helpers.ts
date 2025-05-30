import { FirebaseError } from 'firebase/app' // Ensure you import FirebaseError type for TypeScript

export const handleFirebaseError = (
  error: FirebaseError,
): string => {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'The sign-in window was closed. Please try again.'

    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Another sign-in window might be open or was closed too quickly.'

    case 'auth/auth-domain-config-required':
      // This is more of a developer-facing error, indicating a configuration issue.
      // If it reaches the user, it means something is wrong with your setup.
      return 'Authentication configuration error. Please try again later.'

    case 'auth/unauthorized-domain':
      // Another developer-facing error. The current domain isn't authorized for OAuth.
      return 'This domain is not authorized for sign-in. Please contact support if this continues.'

    case 'auth/web-storage-unsupported':
      return 'Your browser does not support the necessary web storage. Please try a different browser or clear your browser data.'

    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please try logging in or use a different email.'

    case 'auth/invalid-email':
      return 'The email address is not valid. Please check it and try again.'

    case 'auth/user-not-found':
      return 'No account found with that email. Please check for typos or sign up.'

    case 'auth/wrong-password':
      return 'The password you entered is incorrect. Please double-check it or try resetting your password.'

    case 'auth/weak-password':
      return 'The password is too weak. Please choose a stronger one.'

    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your internet connection and try again.'

    case 'auth/operation-not-allowed':
      // This often means a specific sign-in method (like Google, Email/Password) isn't enabled
      // in your Firebase Authentication settings.
      return 'This sign-in method is not enabled. Please contact support.'

    case 'auth/user-disabled':
      return 'Your account has been disabled. Please contact support for assistance.'

    default:
      // A generic fallback for any unhandled errors.
      // console.error(
      //   'Unhandled Firebase Auth error:',
      //   error.code,
      //   error.message,
      // )
      return 'An unexpected error occurred. Please try again or contact support if the issue persists.'
  }
}


