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
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please complete all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await AsyncStorage.setItem('userToken', user.uid);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('onboardingComplete', 'false');

      try {
        router.replace('/(onboarding)/goals' as any);
      } catch (e) {
        Alert.alert('Navigation error', 'Could not navigate to onboarding. Please update the app or contact support.');
        console.warn('Navigation error:', e);
      }
    } catch (err: any) {
      console.warn(err);
      const message = err?.message ?? 'Sign-up failed. Please try again.';
      Alert.alert('Sign-up failed', message);
    } finally {
      setLoading(false);
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
              <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
              <Text style={styles.subtitle}>Sign up to get started with your journey</Text>
            </View>

            <View style={styles.form}>
              {/* Email Input */}
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

              {/* Password Input */}
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

              {/* Confirm Password Input */}
              <View style={styles.field}>
                <Feather name="check-circle" size={20} style={styles.icon} />
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                  placeholderTextColor="#9AA4B2"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(s => !s)} style={styles.eyeButton}>
                  <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={18} style={styles.eyeIcon} />
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#0B1220" />
                ) : (
                  <LinearGradient
                    colors={["#7C3AED", "#06B6D4"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.buttonGradient}
                  >
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>Register</ThemedText>
                  </LinearGradient>
                )}
              </Pressable>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>

              {/* Social Sign Up */}
              <Pressable style={styles.secondaryButton} onPress={() => Alert.alert('Not implemented', 'Social sign-up not implemented here')}>
                <View style={styles.socialRow}>
                  <Feather name="log-in" size={18} style={{ marginRight: 8 }} />
                  <Text style={styles.secondaryText}>Sign up with Google</Text>
                </View>
              </Pressable>

              {/* Login Link */}
              <Pressable onPress={() => router.push('/(auth)/login')} style={styles.linkButton}>
                <Text style={styles.registerText}>Already have an account? <Text style={{fontWeight:'700'}}>Sign In</Text></Text>
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
  button: { borderRadius: 12, overflow: 'hidden', marginTop: 12, marginBottom: 12 },
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