import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to Calorie Tracker
      </ThemedText>
      <ThemedView style={styles.buttonContainer}>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <ThemedText type="defaultSemiBold" style={styles.button}>
            Sign In
          </ThemedText>
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <ThemedText type="defaultSemiBold" style={styles.button}>
            Sign Up
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    color: '#fff',
  },
});