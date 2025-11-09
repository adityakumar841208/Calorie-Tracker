import { router } from 'expo-router';
import { useEffect } from 'react';

// OTP flow has been removed. Redirect to login.
export default function OtpScreen() {
  useEffect(() => {
    router.replace('/(auth)/login' as any);
  }, []);
  return null;
}