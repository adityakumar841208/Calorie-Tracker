import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';

const MOCK_DATA = {
  weeklyAverage: 1850,
  weeklyProgress: [
    { day: 'Mon', calories: 2100 },
    { day: 'Tue', calories: 1950 },
    { day: 'Wed', calories: 1800 },
    { day: 'Thu', calories: 2200 },
    { day: 'Fri', calories: 1750 },
    { day: 'Sat', calories: 1600 },
    { day: 'Sun', calories: 1550 },
  ],
  macroBreakdown: {
    carbs: 45,
    protein: 30,
    fat: 25,
  },
  streakDays: 7,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = (SCREEN_WIDTH - 64) / 7 - 8;

export default function AnalyticsScreen() {
  const maxCalories = Math.max(...MOCK_DATA.weeklyProgress.map(day => day.calories));

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Analytics</ThemedText>
      </ThemedView>

      {/* Weekly Average Card */}
      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          <ThemedText type="subtitle">Weekly Average</ThemedText>
          <ThemedText type="title" style={styles.averageNumber}>
            {MOCK_DATA.weeklyAverage}
          </ThemedText>
          <ThemedText style={styles.subtitle}>calories per day</ThemedText>
        </ThemedView>

        {/* Bar Chart */}
        <ThemedView style={styles.chart}>
          {MOCK_DATA.weeklyProgress.map(day => (
            <ThemedView key={day.day} style={styles.barContainer}>
              <ThemedView
                style={[
                  styles.bar,
                  {
                    height: (day.calories / maxCalories) * 150,
                    backgroundColor: day.calories > 2000 ? '#FF3B30' : '#007AFF',
                  },
                ]}
              />
              <ThemedText style={styles.barLabel}>{day.day}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Macro Breakdown Card */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Macro Breakdown</ThemedText>
        <ThemedView style={styles.macroContainer}>
          <ThemedView style={styles.macroItem}>
            <ThemedView style={[styles.macroCircle, { backgroundColor: '#007AFF' }]}>
              <ThemedText style={styles.macroPercentage}>{MOCK_DATA.macroBreakdown.carbs}%</ThemedText>
            </ThemedView>
            <ThemedText style={styles.macroLabel}>Carbs</ThemedText>
          </ThemedView>
          <ThemedView style={styles.macroItem}>
            <ThemedView style={[styles.macroCircle, { backgroundColor: '#34C759' }]}>
              <ThemedText style={styles.macroPercentage}>{MOCK_DATA.macroBreakdown.protein}%</ThemedText>
            </ThemedView>
            <ThemedText style={styles.macroLabel}>Protein</ThemedText>
          </ThemedView>
          <ThemedView style={styles.macroItem}>
            <ThemedView style={[styles.macroCircle, { backgroundColor: '#FF9500' }]}>
              <ThemedText style={styles.macroPercentage}>{MOCK_DATA.macroBreakdown.fat}%</ThemedText>
            </ThemedView>
            <ThemedText style={styles.macroLabel}>Fat</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Streak Card */}
      <ThemedView style={styles.card}>
        <ThemedView style={styles.streakContainer}>
          <IconSymbol name="flame.fill" size={48} color="#FF3B30" />
          <ThemedView style={styles.streakInfo}>
            <ThemedText type="title">{MOCK_DATA.streakDays} Days</ThemedText>
            <ThemedText style={styles.streakLabel}>Current Streak</ThemedText>
          </ThemedView>
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
    padding: 16,
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  averageNumber: {
    color: '#007AFF',
    marginVertical: 8,
  },
  subtitle: {
    color: '#666',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    paddingTop: 24,
  },
  barContainer: {
    alignItems: 'center',
    width: BAR_WIDTH,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
    backgroundColor: '#007AFF',
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  macroPercentage: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  macroLabel: {
    color: '#666',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakLabel: {
    color: '#666',
  },
});