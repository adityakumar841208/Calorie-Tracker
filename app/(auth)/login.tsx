import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

export default function ModernLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please provide both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await AsyncStorage.setItem('userToken', user.uid);
      await AsyncStorage.setItem('userEmail', email);

      const hasCompletedOnboarding = await AsyncStorage.getItem('onboardingComplete');
      if (hasCompletedOnboarding === 'true') {
        try {
          router.replace('/(app)');
        } catch (e) {
          Alert.alert('Navigation error', 'Could not navigate to app. Please update the app or contact support.');
          console.warn('Navigation error:', e);
        }
      } else {
        try {
          router.replace('/(onboarding)/goals');
        } catch (e) {
          Alert.alert('Navigation error', 'Could not navigate to onboarding. Please update the app or contact support.');
          console.warn('Navigation error:', e);
        }
      }
    } catch (e: any) {
      console.warn(e);
      const message = e?.message ?? 'Login failed. Please try again.';
      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  }

  const handleForgetPassword = async (email: string) => {
    if (!email || !email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email address first to reset your password.', [
        { text: 'OK', style: 'default' }
      ]);
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.', [
        { text: 'OK', style: 'default' }
      ]);
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Email Sent! ✅', 
        `A password reset link has been sent to:\n\n${email}\n\nPlease check your inbox and spam folder.`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error: any) {
      let errorMessage = 'Failed to send reset link. Please try again later.';
      
      if (error?.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error?.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      
      Alert.alert('Reset Failed', errorMessage, [
        { text: 'OK', style: 'default' }
      ]);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#0f172a", "#081126"]}
          style={styles.gradient}
        >
          <ThemedView style={styles.card}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
            <Text style={styles.subtitle}>Sign in to continue to your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <MaterialIcons name="email" size={20} style={styles.icon} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                placeholderTextColor="#9AA4B2"
                importantForAutofill="yes"
              />
            </View>

            <View style={styles.field}>
              <Feather name="lock" size={20} style={styles.icon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholderTextColor="#9AA4B2"
              />
              <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.eyeButton}>
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowBetween}>
              <Pressable 
                onPress={() => handleForgetPassword(email)} 
                disabled={resetLoading}
                style={styles.forgotButton}
              >
                {resetLoading ? (
                  <View style={styles.forgotLoadingContainer}>
                    <ActivityIndicator size="small" color="#8BD3E6" />
                    <Text style={[styles.forgotText, { marginLeft: 8 }]}>Sending...</Text>
                  </View>
                ) : (
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                )}
              </Pressable>
            </View>

            <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#0B1220" />
              ) : (
                <LinearGradient
                  colors={["#7C3AED", "#06B6D4"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buttonGradient}
                >
                  <ThemedText type="defaultSemiBold" style={styles.buttonText}>Sign In</ThemedText>
                </LinearGradient>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <Pressable style={styles.secondaryButton} onPress={() => Alert.alert('Not implemented', 'Social sign-in not implemented here')}>
              <View style={styles.socialRow}>
                <Feather name="log-in" size={18} style={{ marginRight: 8 }} />
                <Text style={styles.secondaryText}>Sign in with Google</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => router.push('/(auth)/register')} style={styles.linkButton}>
              <Text style={styles.registerText}>Don&apos;t have an account? <Text style={{fontWeight:'700'}}>Register</Text></Text>
            </Pressable>
          </View>
          </ThemedView>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  gradient: { minHeight: '100%', justifyContent: 'center', padding: 10 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    backdropFilter: 'blur(6px)'
  },
  header: { marginBottom: 18 },
  title: { fontSize: 28, marginBottom: 6 },
  subtitle: { color: '#9AA4B2' },
  form: { marginTop: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11,18,32,0.6)',
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 42,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)'
  },
  icon: { color: '#9AA4B2', marginRight: 8 },
  input: { flex: 1, color: '#E6EEF8', fontSize: 16, paddingVertical: 8 },
  eyeButton: { padding: 8, transform: [{ translateX: 0 }] },
  eyeIcon: { color: '#9AA4B2' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 12 },
  forgotButton: { paddingVertical: 4 },
  forgotLoadingContainer: { flexDirection: 'row', alignItems: 'center' },
  forgotText: { color: '#8BD3E6', fontWeight: '600' },
  remember: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1, borderColor: '#2B3440', marginRight: 8, backgroundColor: 'transparent' },
  rememberText: { color: '#9AA4B2' },
  button: { borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  buttonGradient: { paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.03)' },
  dividerText: { marginHorizontal: 12, color: '#9AA4B2' },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  socialRow: { flexDirection: 'row', alignItems: 'center' },
  secondaryText: { color: '#E6EEF8' },
  linkButton: { marginTop: 12, alignItems: 'center' },
  registerText: { color: '#9AA4B2' },
});
