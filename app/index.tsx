import { router } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    // Redirect to welcome screen
    router.replace('/welcome');
  }, []);

  return null;
}