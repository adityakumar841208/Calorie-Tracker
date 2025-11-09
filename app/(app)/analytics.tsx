import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Dimensions, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

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
const BAR_WIDTH = (SCREEN_WIDTH - 64) / 7 - 4;

export default function AnalyticsScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#0B0B0C' : '#F8F9FB',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '#2C2C2E' : '#E5E5E7',
    textPrimary: isDark ? '#F3F3F3' : '#111',
    textSecondary: isDark ? '#A5A5A7' : '#666',
    accent: '#007AFF',
    warn: '#FF3B30',
    success: '#34C759',
    orange: '#FF9500',
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  const maxCalories = Math.max(...MOCK_DATA.weeklyProgress.map((d) => d.calories));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >

      {/* Weekly Average */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.cardHeader}>
          <ThemedText type="subtitle" style={{ color: colors.textPrimary }}>
            Weekly Average
          </ThemedText>
          <ThemedText type="title" style={[styles.averageNumber, { color: colors.accent }]}>
            {MOCK_DATA.weeklyAverage}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            calories per day
          </ThemedText>
        </View>

        {/* Bar Chart */}
        <View style={styles.chart}>
          {MOCK_DATA.weeklyProgress.map((day) => (
            <View key={day.day} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (day.calories / maxCalories) * 150,
                    backgroundColor:
                      day.calories > 2000 ? colors.warn : colors.accent,
                  },
                ]}
              />
              <ThemedText style={[styles.barLabel, { color: colors.textSecondary }]}>
                {day.day}
              </ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Macro Breakdown */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <ThemedText type="subtitle" style={{ color: colors.textPrimary }}>
          Macro Breakdown
        </ThemedText>

        <View style={styles.macroContainer}>
          {[
            { label: 'Carbs', color: colors.accent, value: MOCK_DATA.macroBreakdown.carbs },
            { label: 'Protein', color: colors.success, value: MOCK_DATA.macroBreakdown.protein },
            { label: 'Fat', color: colors.orange, value: MOCK_DATA.macroBreakdown.fat },
          ].map((m) => (
            <View key={m.label} style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: m.color }]}>
                <ThemedText style={styles.macroPercentage}>{m.value}%</ThemedText>
              </View>
              <ThemedText style={[styles.macroLabel, { color: colors.textSecondary }]}>
                {m.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Streak */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.streakContainer}>
          <IconSymbol name="flame.fill" size={48} color={colors.warn} />
          <View style={styles.streakInfo}>
            <ThemedText type="title" style={{ color: colors.textPrimary }}>
              {MOCK_DATA.streakDays} Days
            </ThemedText>
            <ThemedText style={[styles.streakLabel, { color: colors.textSecondary }]}>
              Current Streak
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  averageNumber: {
    marginTop: 4,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    paddingTop: 10,
  },
  barContainer: {
    alignItems: 'center',
    width: BAR_WIDTH + 6,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 8,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 13,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  macroPercentage: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  macroLabel: {
    fontSize: 14,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  streakInfo: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 14,
  },
});
