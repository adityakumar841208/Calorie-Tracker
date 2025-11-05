import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { Equal, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

const GOALS = [
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    description: 'Reduce body weight through caloric deficit',
    Icon: TrendingDown,
  },
  {
    id: 'weight-gain',
    title: 'Weight Gain',
    description: 'Build muscle and increase body weight',
    Icon: TrendingUp,
  },
  {
    id: 'maintain',
    title: 'Maintain Weight',
    description: 'Keep current weight while staying healthy',
    Icon: Equal,
  },
];

export default function GoalsScreen() {
  const [selectedGoal, setSelectedGoal] = useState('');

  const handleContinue = () => {
    if (selectedGoal) {
      router.push({
        pathname: '/(onboarding)/target',
        params: { goal: selectedGoal }
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" className="mb-8">Select Your Goal</ThemedText>
        
        <ThemedView style={styles.goalsContainer}>
          {GOALS.map(goal => (
            <Pressable
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoal === goal.id && styles.goalCardSelected
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <goal.Icon
                size={40}
                color={selectedGoal === goal.id ? '#fff' : '#007AFF'}
              />
              <ThemedText
                type="subtitle"
                style={[
                  styles.goalTitle,
                  selectedGoal === goal.id && styles.goalTextSelected
                ]}
              >
                {goal.title}
              </ThemedText>
              <ThemedText
                style={[
                  styles.goalDescription,
                  selectedGoal === goal.id && styles.goalTextSelected
                ]}
              >
                {goal.description}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <Pressable
          onPress={handleContinue}
          style={[styles.button, !selectedGoal && styles.buttonDisabled]}
          disabled={!selectedGoal}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
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
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    gap: 8,
  },
  goalCardSelected: {
    backgroundColor: '#007AFF',
  },
  goalTitle: {
    textAlign: 'center',
  },
  goalDescription: {
    textAlign: 'center',
    color: '#666',
  },
  goalTextSelected: {
    color: '#fff',
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