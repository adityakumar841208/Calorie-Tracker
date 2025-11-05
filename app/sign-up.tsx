import { router } from 'expo-router';
import { useEffect } from 'react';

// Compatibility redirect for legacy `/sign-up` path. Forward users to
// the consolidated auth group's register screen.
export default function SignUpRedirect() {
  useEffect(() => {
    router.replace('/(auth)/register' as any);
  }, []);

  return null;
}