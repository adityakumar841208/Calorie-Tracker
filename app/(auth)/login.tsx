import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
                                    router.replace('/(app)' as any);
                                } catch (e) {
                                    Alert.alert('Navigation error', 'Could not navigate to app. Please update the app or contact support.');
                                    console.warn('Navigation error:', e);
                                }
                        } else {
                                try {
                                    router.replace('/(onboarding)/goals' as any);
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.wrapper}
        >
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.title}>
                    Welcome Back
                </ThemedText>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        style={styles.input}
                        placeholderTextColor="#666"
                    />

                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#666"
                    />

                    <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                                Sign In
                            </ThemedText>
                        )}
                    </Pressable>

                    <Pressable onPress={() => router.push('/(auth)/register')} style={styles.linkButton}>
                        <ThemedText type="link">Do not have an account? Register</ThemedText>
                    </Pressable>
                </View>
            </ThemedView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        marginBottom: 24,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 400,
        gap: 12,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
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
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 12,
        alignItems: 'center',
    },
});