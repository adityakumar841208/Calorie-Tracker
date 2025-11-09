import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { Equal, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme } from 'react-native';

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
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#0B0B0C' : '#F8F9FB',
    card: isDark ? '#1A1A1D' : '#FFFFFF',
    border: isDark ? '#2C2C2F' : '#E5E5E7',
    accent: '#007AFF',
    textPrimary: isDark ? '#F3F3F3' : '#111',
    textSecondary: isDark ? '#A5A5A7' : '#555',
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  const handleContinue = () => {
    if (selectedGoal) {
      router.push({
        pathname: '/(onboarding)/target',
        params: { goal: selectedGoal },
      });
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
          style={[styles.headerTitle, { color: colors.textPrimary }]}
        >
          Select Your Goal
        </ThemedText>

        <ThemedView style={styles.goalsContainer}>
          {GOALS.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            return (
              <Pressable
                key={goal.id}
                onPress={() => setSelectedGoal(goal.id)}
                style={[
                  styles.goalCard,
                  {
                    backgroundColor: isSelected ? colors.accent : colors.card,
                    borderColor: isSelected ? colors.accent : colors.border,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <goal.Icon
                  size={40}
                  color={isSelected ? '#FFF' : colors.accent}
                  strokeWidth={2.5}
                />
                <ThemedText
                  type="subtitle"
                  style={[
                    styles.goalTitle,
                    { color: isSelected ? '#FFF' : colors.textPrimary },
                  ]}
                >
                  {goal.title}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.goalDescription,
                    { color: isSelected ? 'rgba(255,255,255,0.85)' : colors.textSecondary },
                  ]}
                >
                  {goal.description}
                </ThemedText>
              </Pressable>
            );
          })}
        </ThemedView>
      </ScrollView>

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
          onPress={handleContinue}
          style={[
            styles.button,
            {
              backgroundColor: selectedGoal ? colors.accent : colors.border,
            },
          ]}
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
    paddingHorizontal: 22,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  goalsContainer: {
    gap: 20,
  },
  goalCard: {
    padding: 22,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    transitionDuration: '200ms',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  goalDescription: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
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
    letterSpacing: 0.3,
  },
});
