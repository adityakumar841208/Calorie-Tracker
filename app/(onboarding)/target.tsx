import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, ScrollView, StyleSheet, ActivityIndicator, useColorScheme, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/services/userService';

type GoalParam = { goal?: string };

const calculateRecommendedCalories = (goal?: string): number => {
  switch (goal) {
    case 'weight-loss': return 1500;
    case 'weight-gain': return 3000;
    default: return 2000;
  }
};

const mapGoalToFirestore = (goal?: string): 'lose' | 'maintain' | 'gain' => {
  switch (goal) {
    case 'weight-loss': return 'lose';
    case 'weight-gain': return 'gain';
    default: return 'maintain';
  }
};

const factForGoal = (goal?: string): string => {
  switch (goal) {
    case 'weight-loss':
      return 'Small, consistent calorie deficits (250–500 kcal/day) are more sustainable and maintain muscle when combined with resistance training.';
    case 'weight-gain':
      return 'A moderate calorie surplus plus progressive resistance training helps you gain muscle without excessive fat gain.';
    case 'maintain':
      return 'Focusing on protein, sleep and activity helps you preserve lean mass while maintaining weight.';
    default:
      return 'Choose a target to personalise your tracking — consistency matters more than perfection.';
  }
};

export default function TargetScreen(): JSX.Element {
  const { goal } = useLocalSearchParams<GoalParam>();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  // Prefill with a reasonable default but allow user to change
  const [calories, setCalories] = useState<string>(String(calculateRecommendedCalories(goal)));
  const [loading, setLoading] = useState<boolean>(false);

  const colors = {
    bg: dark ? '#07080A' : '#F6F8FB',
    card: dark ? '#0F1722' : '#FFFFFF',
    muted: dark ? '#9AA4B2' : '#6B7280',
    accentFrom: '#7C3AED',
    accentTo: '#06B6D4',
    border: dark ? 'rgba(255,255,255,0.04)' : 'rgba(2,6,23,0.06)'
  } as const;

  const handleComplete = async (): Promise<void> => {
    if (!auth.currentUser) {
      Alert.alert('Not signed in', 'You must be logged in to finish onboarding.');
      return;
    }

    const parsed = parseInt(calories || '0', 10);
    if (!parsed || parsed < 800 || parsed > 10000) {
      Alert.alert('Invalid value', 'Please enter a realistic calorie number (800–10000).');
      return;
    }

    setLoading(true);
    try {
      // auth.authStateReady may be a helper in your project — guard if not present
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await (auth as any).authStateReady?.();

      const firestoreGoal = mapGoalToFirestore(goal);
      await createUserProfile(auth.currentUser.uid, firestoreGoal, parsed);

      await AsyncStorage.setItem('userGoal', goal ?? 'maintain');
      await AsyncStorage.setItem('targetCalories', String(parsed));
      await AsyncStorage.setItem('onboardingComplete', 'true');

      router.replace('/(app)/home');
    } catch (err: unknown) {
      console.warn('Failed to save target', err);
      Alert.alert('Save failed', (err as Error)?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.root, { backgroundColor: colors.bg }]}> 
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: dark ? '#F8FAFC' : '#071025' }]}>Set your daily target</ThemedText>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Personalise your plan for {goal ? goal.replace('-', ' ') : 'your goal'}.</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 

          <View style={styles.inputRow}>
            <TextInput
              value={calories}
              onChangeText={(t) => setCalories(t.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              style={[styles.input, { color: dark ? '#E6EEF8' : '#071025', borderColor: colors.border }]}
              placeholder="Enter calories"
              placeholderTextColor={colors.muted}
              maxLength={5}
              accessible
              accessibilityLabel="Target calories per day"
            />
            <Text style={[styles.unit, { color: colors.muted }]}>cal/day</Text>
          </View>

          <View style={styles.factBox}>
            <Text style={[styles.factTitle, { color: dark ? '#F8FAFC' : '#071025' }]}>Quick fact</Text>
            <Text style={[styles.factText, { color: colors.muted }]}>{factForGoal(goal)}</Text>
          </View>

        </View>

      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: dark ? '#071225' : '#FFF' }]}> 
        <Pressable onPress={handleComplete} disabled={!calories || loading} style={({ pressed }) => [styles.cta, { opacity: !calories ? 0.6 : 1, transform: [{ scale: pressed ? 0.995 : 1 }] }]}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <LinearGradient colors={[colors.accentFrom, colors.accentTo]} start={[0,0]} end={[1,1]} style={styles.ctaGradient}>
              <Text style={styles.ctaText}>Start Tracking</Text>
            </LinearGradient>
          )}
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { paddingHorizontal: 22, paddingTop: 48, alignItems: 'center' },
  header: { marginBottom: 16, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 13, opacity: 0.95 },

  card: { width: '100%', borderRadius: 16, padding: 20, alignItems: 'center', gap: 16, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width:0,height:6}, shadowRadius: 18, elevation: 6 },

  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 6 },
  input: { fontSize: 40, fontWeight: '800', width: 160, borderBottomWidth: 2, paddingVertical: 6, textAlign: 'center' },
  unit: { fontSize: 14, marginBottom: 8 },

  factBox: { marginTop: 8, width: '100%', backgroundColor: 'transparent', padding: 12, borderRadius: 12 },
  factTitle: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  factText: { fontSize: 14, lineHeight: 20 },

  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18, borderTopWidth: 1, shadowOffset: { width:0, height:-6 }, shadowOpacity: 0.06, shadowRadius: 12 },
  cta: { height: 38, borderRadius: 12, overflow: 'hidden' },
  ctaGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});
