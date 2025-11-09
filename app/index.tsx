import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  console.log('WelcomeScreen rendering');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to Calorie Tracker
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => router.push('/(auth)/login')} style={styles.button}>
          <Text style={styles.buttonText}>
            Sign In
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/register')} style={styles.button}>
          <Text style={styles.buttonText}>
            Sign Up
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 40,
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});