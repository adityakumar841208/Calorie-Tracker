import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

export default function RemindersLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#111827' : '#F9FAFB',
        },
      }}
    />
  );
}
