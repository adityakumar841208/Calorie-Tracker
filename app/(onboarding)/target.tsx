import { auth } from '@/lib/firebase';
import { createUserProfile, getUserProfile, updateUserProfile } from '@/services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Equal, Target, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
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
  useColorScheme,
  View
} from 'react-native';

type GoalParam = { goal?: string };

const getGoalConfig = (goal?: string) => {
  switch (goal) {
    case 'weight-loss':
      return { 
        recommended: 1800, 
        maintenance: 2300,
        icon: TrendingDown,
        color: '#10B981',
        title: 'Weight Loss',
        description: 'Create a calorie deficit to lose weight'
      };
    case 'weight-gain':
      return { 
        recommended: 2800, 
        maintenance: 2300,
        icon: TrendingUp,
        color: '#F59E0B',
        title: 'Weight Gain',
        description: 'Create a calorie surplus to gain weight'
      };
    default:
      return { 
        recommended: 2200, 
        maintenance: 2300,
        icon: Equal,
        color: '#06B6D4',
        title: 'Maintain Weight',
        description: 'Balance your calorie intake'
      };
  }
};

export default function TargetScreen() {
  const { goal } = useLocalSearchParams<GoalParam>();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const goalConfig = getGoalConfig(goal);

  // State
  const [calories, setCalories] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [projection, setProjection] = useState<{ val: string; type: 'lose' | 'gain' | 'maintain' }>({ val: '0', type: 'maintain' });

  // Colors matching your app theme
  const colors = {
    bg: isDark ? '#0B0F14' : '#F7F9FB',
    cardBg: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.8)', // Glassy background
    text: isDark ? '#F8FAFC' : '#0F172A',
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
  };

  // Calculation Effect
  useEffect(() => {
    const val = parseInt(calories) || 0;
    const maintenance = goalConfig.maintenance;
    const diff = val - maintenance;
    
    // Calculate weight change: (Daily Deficit × 180 Days) ÷ 7700 calories per kg
    const totalCalorieDiff = diff * 180;
    const weightDiffKg = totalCalorieDiff / 7700; // Negative = loss, Positive = gain

    let type: 'lose' | 'gain' | 'maintain' = 'maintain';
    if (diff < -150) type = 'lose';
    else if (diff > 150) type = 'gain';

    setProjection({
      val: val === 0 ? '0' : Math.abs(weightDiffKg).toFixed(1),
      type
    });
  }, [calories, weight, goalConfig.maintenance]);

  const getDateIn6Months = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleComplete = async (): Promise<void> => {
    if (!auth.currentUser) {
      Alert.alert('Not signed in', 'You must be logged in to finish onboarding.');
      return;
    }
    const parsed = parseInt(calories || '0', 10);
    const parsedWeight = parseFloat(weight || '0');
    
    if (!parsed || parsed < 800 || parsed > 10000) {
      Alert.alert('Invalid Target', 'Please enter a realistic calorie number (800–10000).');
      return;
    }
    
    if (!parsedWeight || parsedWeight < 30 || parsedWeight > 300) {
      Alert.alert('Invalid Weight', 'Please enter your current weight (30-300 kg).');
      return;
    }

    setLoading(true);
    console.log('Starting profile update/create...');
    try {
      // @ts-ignore 
      await auth.authStateReady?.();
      
      const firestoreGoal = goal === 'weight-loss' ? 'lose' : goal === 'weight-gain' ? 'gain' : 'maintain';
      console.log('User ID:', auth.currentUser.uid);
      console.log('Goal:', firestoreGoal, 'Calories:', parsed, 'Weight:', parsedWeight);
      
      // Check if user profile already exists
      console.log('Checking for existing profile...');
      const existingProfile = await getUserProfile(auth.currentUser.uid);
      console.log('Existing profile:', existingProfile);
      
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile...');
        await updateUserProfile(auth.currentUser.uid, {
          goal: firestoreGoal,
          targetCalories: parsed,
          weight: parsedWeight
        });
        console.log('Profile updated successfully');
      } else {
        // Create new profile
        console.log('Creating new profile...');
        await createUserProfile(auth.currentUser.uid, firestoreGoal, parsed, parsedWeight);
        console.log('Profile created successfully');
      }

      await AsyncStorage.setItem('userGoal', goal ?? 'maintain');
      await AsyncStorage.setItem('targetCalories', String(parsed));
      await AsyncStorage.setItem('userWeight', String(parsedWeight));
      await AsyncStorage.setItem('onboardingComplete', 'true');
      console.log('AsyncStorage updated');

      console.log('Navigating to home...');
      router.replace('/(app)/home');
    } catch (err: any) {
      console.error('Error in handleComplete:', err);
      Alert.alert('Error', err.message || 'Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0B0F14', '#1a1f2e', '#0B0F14'] : ['#F7F9FB', '#E0E7FF', '#F7F9FB']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Header with Goal Icon */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{goalConfig.title}</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>{goalConfig.description}
            </Text>
          </View>

          {/* Calorie Input Card */}
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.cardLabel, { color: colors.subtext }]}>DAILY CALORIE TARGET</Text>
            
            <View style={styles.inputRow}>
              <TextInput
                value={calories}
                onChangeText={(t) => setCalories(t.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                style={[styles.input, { color: colors.text }]}
                placeholder="0"
                placeholderTextColor={colors.subtext}
                maxLength={5}
                selectionColor={goalConfig.color}
                // Android Fixes
                underlineColorAndroid="transparent"
                textAlignVertical="center"
              />
              <Text style={[styles.unit, { color: colors.subtext }]}>kcal</Text>
            </View>

            <View style={[styles.recommendationBadge, { backgroundColor: goalConfig.color + '20' }]}>
              <Target size={14} color={goalConfig.color} />
              <Text style={[styles.recommendationText, { color: isDark ? '#E2E8F0' : '#475569' }]}>
                Recommended: {goalConfig.recommended} kcal
              </Text>
            </View>
          </View>

          {/* Weight Input Card */}
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.cardLabel, { color: colors.subtext }]}>CURRENT WEIGHT</Text>
            
            <View style={styles.inputRow}>
              <TextInput
                value={weight}
                onChangeText={(t) => setWeight(t.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
                style={[styles.input, { color: colors.text }]}
                placeholder="0"
                placeholderTextColor={colors.subtext}
                maxLength={5}
                selectionColor={goalConfig.color}
                underlineColorAndroid="transparent"
                textAlignVertical="center"
              />
              <Text style={[styles.unit, { color: colors.subtext }]}>kg</Text>
            </View>

            <Text style={[styles.helperText, { color: colors.subtext }]}>
              Enter your current weight (in kilograms)
            </Text>
          </View>

          {/* 6-Month Projection */}
          {goal !== 'maintain' && calories !== '0' && calories !== '' && weight !== '' && weight !== '0' && (
            <LinearGradient
              colors={
                projection.type === 'lose' 
                  ? isDark ? ['#064E3B', '#065F46'] : ['#D1FAE5', '#A7F3D0']
                  : projection.type === 'gain' 
                  ? isDark ? ['#78350F', '#92400E'] : ['#FED7AA', '#FDE68A']
                  : isDark ? ['#1E293B', '#334155'] : ['#E0E7FF', '#DDD6FE']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={[styles.projectionCard, { borderColor: colors.border }]}
            >
              <View style={styles.projectionHeader}>
                <Text style={[styles.projectionTitle, { color: isDark ? '#FFF' : '#1E293B' }]}>
                  📊 6-Month Projection
                </Text>
              </View>
              
              <Text style={[styles.projectionText, { color: isDark ? '#E2E8F0' : '#475569' }]}>
                By <Text style={{ fontWeight: '700' }}>{getDateIn6Months()}</Text>, you could
              </Text>

              {projection.type !== 'maintain' ? (
                <View style={styles.projectionValueContainer}>
                  <Text style={[styles.projectionAction, { color: projection.type === 'lose' ? (isDark ? '#34D399' : '#059669') : (isDark ? '#FBBF24' : '#D97706') }]}>
                    {projection.type === 'lose' ? '↓ Lose' : '↑ Gain'}
                  </Text>
                  <Text style={[styles.projectionValue, { color: projection.type === 'lose' ? (isDark ? '#34D399' : '#059669') : (isDark ? '#FBBF24' : '#D97706') }]}>
                    {projection.val} kg
                  </Text>
                  <Text style={[styles.projectionSubtext, { color: colors.subtext }]}>
                    (~{(parseFloat(projection.val) * 2.2).toFixed(1)} lbs)
                  </Text>
                  {parseFloat(weight) > 0 && (
                    <Text style={[styles.projectionPercentage, { color: colors.subtext }]}>
                      {((parseFloat(projection.val) / parseFloat(weight)) * 100).toFixed(1)}% of current weight
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={[styles.projectionMaintain, { color: isDark ? '#A5B4FC' : '#6366F1' }]}>
                  Maintain your current weight
                </Text>
              )}
            </LinearGradient>
          )}

        </ScrollView>

        {/* Footer Button */}
        <View style={[styles.footer, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
          <Pressable 
            onPress={handleComplete} 
            disabled={!calories || !weight || loading} 
            style={({ pressed }) => [
              styles.cta, 
              { opacity: (!calories || !weight) ? 0.5 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
          >
            {loading ? (
              <View style={styles.cta}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              
                <Text style={styles.ctaText}>Start Tracking</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { 
    flexGrow: 1,
    paddingHorizontal: 20, 
    paddingTop: 30,
    paddingBottom: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  // Header
  header: { alignItems: 'center', marginBottom: 16, width: '100%', maxWidth: 400 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 13, textAlign: 'center', lineHeight: 18, maxWidth: '80%' },

  // Input Card
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  cardLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 10, opacity: 0.7 },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 },
  input: {
    fontSize: 32,
    height: 42,
    fontWeight: '800',
    textAlign: 'center',
    minWidth: 100,
    paddingVertical: 0,
  },
  unit: { fontSize: 14, fontWeight: '600', opacity: 0.7 },
  recommendationBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 10, 
    gap: 6 
  },
  recommendationText: { fontSize: 11, fontWeight: '600' },

  // Projection Card
  projectionCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  projectionHeader: { marginBottom: 6, alignItems: 'center' },
  projectionTitle: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  projectionText: { fontSize: 12, lineHeight: 16, textAlign: 'center', marginBottom: 8 },
  projectionValueContainer: { alignItems: 'center', gap: 2 },
  projectionAction: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  projectionValue: { fontSize: 24, fontWeight: '800' },
  projectionSubtext: { fontSize: 11, opacity: 0.8 },
  projectionPercentage: { fontSize: 10, opacity: 0.7, marginTop: 2, fontStyle: 'italic' },
  projectionMaintain: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  helperText: { fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: 'center' },

  // Footer
 footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  cta: {
    height: 38,
    borderRadius: 12,
    backgroundColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ctaText: { color: '#FFF', fontWeight: '700', fontSize: 16, paddingHorizontal: 5 }
});