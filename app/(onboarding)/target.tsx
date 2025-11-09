import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, useColorScheme } from 'react-native';

const calculateRecommendedCalories = (goal: string) => {
  switch (goal) {
    case 'weight-loss':
      return 1500;
    case 'weight-gain':
      return 3000;
    case 'maintain':
    default:
      return 2000;
  }
};

export default function TargetScreen() {
  const { goal } = useLocalSearchParams<{ goal: string }>();
  const [calories, setCalories] = useState(calculateRecommendedCalories(goal).toString());
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#0B0B0C' : '#F8F9FB',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '#2C2C2E' : '#E5E5E7',
    textPrimary: isDark ? '#F3F3F3' : '#111',
    textSecondary: isDark ? '#A5A5A7' : '#666',
    accent: '#007AFF',
    shadow: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)',
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('userGoal', goal);
      await AsyncStorage.setItem('targetCalories', calories);
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/(app)/home');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          type="title"
          style={[styles.title, { color: colors.textPrimary }]}
        >
          Set Your Daily Target
        </ThemedText>

        <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
            Based on your goal to{' '}
            <ThemedText style={{ color: colors.accent, fontWeight: '600' }}>
              {goal.replace('-', ' ')}
            </ThemedText>
            , we recommend:
          </ThemedText>

          <ThemedView style={styles.inputContainer}>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              keyboardType="number-pad"
              style={[
                styles.calorieInput,
                { color: colors.textPrimary, borderBottomColor: colors.accent },
              ]}
              maxLength={4}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
            <ThemedText style={[styles.calorieUnit, { color: colors.textSecondary }]}>
              calories/day
            </ThemedText>
          </ThemedView>

          <ThemedText style={[styles.hint, { color: colors.textSecondary }]}>
            You can adjust this later in settings based on your progress.
          </ThemedText>
        </ThemedView>
      </ScrollView>

      {/* Sticky Footer */}
      <ThemedView
        style={[
          styles.footer,
          {
            backgroundColor: isDark ? '#101011' : '#FFF',
            borderTopColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Pressable
          onPress={handleComplete}
          style={[
            styles.button,
            { backgroundColor: calories ? colors.accent : colors.border },
          ]}
          disabled={!calories}
        >
          <ThemedText style={styles.buttonText}>Start Tracking</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  calorieInput: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    width: 160,
    borderBottomWidth: 3,
    paddingVertical: 6,
  },
  calorieUnit: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  hint: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
