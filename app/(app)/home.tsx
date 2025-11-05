import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

const MOCK_DATA = {
  dailyGoal: 2000,
  consumed: 1450,
  remaining: 550,
  waterGoal: 8,
  waterConsumed: 5,
  meals: [
    { id: 1, name: 'Breakfast', calories: 350, time: '8:30 AM' },
    { id: 2, name: 'Lunch', calories: 650, time: '1:00 PM' },
    { id: 3, name: 'Snack', calories: 200, time: '4:00 PM' },
    { id: 4, name: 'Dinner', calories: 250, time: '7:30 PM' },
  ],
};

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Today</ThemedText>
        <IconSymbol name="bell.fill" size={24} color="#666" />
      </ThemedView>

      {/* Calorie Summary Card */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Calories</ThemedText>
        <ThemedView style={styles.calorieCircle}>
          <ThemedText style={styles.calorieRemaining}>{MOCK_DATA.remaining}</ThemedText>
          <ThemedText>remaining</ThemedText>
        </ThemedView>
        <ThemedView style={styles.calorieStats}>
          <ThemedView style={styles.calorieStat}>
            <ThemedText>{MOCK_DATA.consumed}</ThemedText>
            <ThemedText style={styles.statLabel}>consumed</ThemedText>
          </ThemedView>
          <ThemedView style={styles.calorieStat}>
            <ThemedText>{MOCK_DATA.dailyGoal}</ThemedText>
            <ThemedText style={styles.statLabel}>daily goal</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Water Tracking Card */}
      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          <ThemedText type="subtitle">Water</ThemedText>
          <IconSymbol name="drop.fill" size={24} color="#007AFF" />
        </ThemedView>
        <ThemedView style={styles.waterContainer}>
          {Array.from({ length: MOCK_DATA.waterGoal }).map((_, index) => (
            <Pressable
              key={index}
              style={[
                styles.waterDrop,
                index < MOCK_DATA.waterConsumed && styles.waterDropFilled,
              ]}
            />
          ))}
        </ThemedView>
        <ThemedText style={styles.waterText}>
          {MOCK_DATA.waterConsumed} of {MOCK_DATA.waterGoal} glasses
        </ThemedText>
      </ThemedView>

      {/* Today's Meals */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Today's Meals</ThemedText>
        <ThemedView style={styles.mealsList}>
          {MOCK_DATA.meals.map(meal => (
            <ThemedView key={meal.id} style={styles.mealItem}>
              <ThemedView>
                <ThemedText type="defaultSemiBold">{meal.name}</ThemedText>
                <ThemedText style={styles.mealTime}>{meal.time}</ThemedText>
              </ThemedView>
              <ThemedText>{meal.calories} cal</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 24,
  },
  calorieRemaining: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  calorieStat: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  waterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 16,
  },
  waterDrop: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
  },
  waterDropFilled: {
    backgroundColor: '#007AFF',
  },
  waterText: {
    textAlign: 'center',
    color: '#666',
  },
  mealsList: {
    marginTop: 16,
    gap: 16,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
  },
});