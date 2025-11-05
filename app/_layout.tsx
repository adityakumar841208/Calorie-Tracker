import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent auto-hiding of splash screen
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Start at the welcome/index screen by default. We'll programmatically
  // redirect from the splash screen depending on auth/onboarding state.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [redirectRoute, setRedirectRoute] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for splash screen effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Pre-load fonts, make API calls, etc.
        await Font.loadAsync({
          // Add custom fonts here
        });

        // Check if user is logged in and decide redirect target.
        // Only auto-redirect to the main app when the user is authenticated
        // AND has completed onboarding. We intentionally do NOT auto-redirect
        // to the onboarding flow when onboarding is incomplete — this avoids
        // surprising navigation when someone opens the root URL.
        const authToken = await AsyncStorage.getItem('userToken');
        if (authToken) {
          const hasCompletedOnboarding = await AsyncStorage.getItem('onboardingComplete');
          if (hasCompletedOnboarding === 'true') {
            setRedirectRoute('/(app)');
          } else {
            // Authenticated but onboarding incomplete: stay on welcome so the
            // user can explicitly continue to onboarding from UI.
            setRedirectRoute('/');
          }
        } else {
          // No token -> stay on the welcome/index screen
          setRedirectRoute('/');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  // Once ready, perform the redirect if one was decided during prepare().
  useEffect(() => {
    if (isReady && redirectRoute) {
      // Use replace so back button doesn't return to splash/welcome unnecessarily.
      try {
        // some route names include group parentheses and the generated route
        // types are narrow; silence the literal-type mismatch by casting.
        router.replace(redirectRoute as any);
      } catch (e) {
        console.warn('Redirect failed', e);
      }
    }
  }, [isReady, redirectRoute]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" options={{ gestureEnabled: false }} />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}
