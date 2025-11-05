import { router } from 'expo-router';
import { useEffect } from 'react';

// This file is a compatibility shim for any code that still navigates to
// `/sign-in`. It immediately redirects into the consolidated auth group.
export default function SignInRedirect() {
  useEffect(() => {
    router.replace('/(auth)/login' as any);
  }, []);

  return null;
}