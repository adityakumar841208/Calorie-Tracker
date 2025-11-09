import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

// Catch-all fallback route for unmatched paths (mainly for web).
// This prevents "No routes matched" when someone visits an invalid URL
// such as `/(onboarding)` (parentheses are file-system grouping syntax
// and not valid public URLs). We inspect the raw pathname and redirect
// to the most likely intended route.
export default function CatchAll() {
  useEffect(() => {
    try {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

      // If the pathname contains the literal '(onboarding)' (someone typed
      // or followed an internal string with group syntax), map it to the
      // onboarding entry point (goals).
      if (pathname.includes('(onboarding)')) {
        router.replace('/goals' as any);
        return;
      }

      // If the pathname contains '(auth)', redirect to auth login.
      if (pathname.includes('(auth)')) {
        router.replace('/(auth)/login' as any);
        return;
      }

      // Fallback: go to app root
      router.replace('/' as any);
    } catch {
      // In case router.replace fails, fallback to root
      try {
        router.replace('/' as any);
      } catch {}
    }
  }, []);

  return <View style={{ flex: 1 }} />;
}
