import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function OtpScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  async function handleVerify() {
    if (otp.length < 4) {
      Alert.alert('Enter OTP', 'Please enter the one-time passcode sent to your email.');
      return;
    }
    setLoading(true);
    try {
      // Mock verification delay
      await new Promise(resolve => setTimeout(resolve, 700));

      // Persist user token and onboarding flag
      const fakeToken = `token-${Date.now()}`;
      await AsyncStorage.setItem('userToken', fakeToken);
      await AsyncStorage.setItem('onboardingComplete', 'false');
      if (email) await AsyncStorage.setItem('userEmail', email);

      // Redirect to onboarding goals (explicit concrete path)
      router.replace('/(onboarding)/goals' as any);
    } catch (e) {
      console.warn(e);
      Alert.alert('Verification failed', 'Unable to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleResend() {
    setTimeLeft(30);
    // Mock resend behavior
    Alert.alert('OTP sent', `A new code was sent to ${email || 'your email'}.`);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Verify your email</ThemedText>
        <ThemedText style={styles.subtitle}>Enter the code we sent to {email || 'your email'}</ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="123456"
            keyboardType="number-pad"
            style={styles.input}
            maxLength={6}
          />

          <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleVerify} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Verify</ThemedText>}
          </Pressable>

          <Pressable onPress={handleResend} style={[styles.linkButton, timeLeft > 0 && styles.linkButtonDisabled]} disabled={timeLeft > 0}>
            <ThemedText type="link" style={timeLeft > 0 ? styles.textDisabled : undefined}>
              {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : 'Resend OTP'}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
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
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  linkButtonDisabled: {
    opacity: 0.5,
  },
  textDisabled: {
    color: '#666',
  },
});