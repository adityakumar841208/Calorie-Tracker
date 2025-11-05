import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

const calculateRecommendedCalories = (goal: string) => {
  // This is a simplified calculation. In a real app, you'd consider:
  // - Current weight
  // - Target weight
  // - Height
  // - Age
  // - Activity level
  // - Gender
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

  const handleComplete = async () => {
    try {
      // Save goal and target calories
      await AsyncStorage.setItem('userGoal', goal);
      await AsyncStorage.setItem('targetCalories', calories);
      await AsyncStorage.setItem('onboardingComplete', 'true');
      
      // Navigate to main app using replace to prevent back navigation
      router.replace('/(app)/home');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" className="mb-8">Set Daily Target</ThemedText>
        
        <ThemedView style={styles.formContainer}>
          <ThemedText>
            Based on your goal to {goal.replace('-', ' ')}, we recommend:
          </ThemedText>
          
          <ThemedView style={styles.calorieContainer}>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              keyboardType="number-pad"
              style={styles.calorieInput}
              maxLength={4}
            />
            <ThemedText style={styles.calorieUnit}>calories/day</ThemedText>
          </ThemedView>

          <ThemedText style={styles.hint}>
            You can always adjust this target later based on your progress
          </ThemedText>
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <Pressable
          onPress={handleComplete}
          style={[styles.button, !calories && styles.buttonDisabled]}
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
    padding: 20,
  },
  formContainer: {
    gap: 24,
    alignItems: 'center',
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calorieInput: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 160,
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  calorieUnit: {
    fontSize: 16,
    color: '#666',
  },
  hint: {
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});