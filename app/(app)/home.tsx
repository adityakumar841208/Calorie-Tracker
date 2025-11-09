import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

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
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#0B0B0C' : '#F8F9FB',
    card: isDark ? '#161618' : '#FFFFFF',
    textPrimary: isDark ? '#EAEAEA' : '#111',
    textSecondary: isDark ? '#A3A3A3' : '#666',
    accent: '#007AFF',
    accentGradient: isDark ? ['#005FCC', '#0094FF'] : ['#007AFF', '#33B7FF'],
    divider: isDark ? '#2A2A2C' : '#E8E8E8',
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ThemedView style={[styles.header]}>
        <ThemedText type="title" style={{ color: colors.textPrimary }}>
          Today
        </ThemedText>
        <Pressable>
          <IconSymbol name="bell" size={26} color={colors.textSecondary} />
        </Pressable>
      </ThemedView>

      {/* Section: Calorie Summary */}
      <LinearGradient
        colors={colors.accentGradient as unknown as readonly [string, string]}
        style={styles.gradientCard}
      >
        <ThemedView style={styles.gradientContent}>
          <ThemedText type="subtitle" style={{ color: '#FFF' }}>
            Calories
          </ThemedText>
          <View style={styles.calorieCircleContainer}>
            <View style={[styles.calorieCircle, { borderColor: '#FFF' }]}>
              <ThemedText style={[styles.calorieRemaining, { color: '#FFF' }]}>
                {MOCK_DATA.remaining}
              </ThemedText>
              <ThemedText style={{ color: '#FFF', opacity: 0.8 }}>remaining</ThemedText>
            </View>
          </View>
          <View style={styles.calorieStats}>
            <View style={styles.calorieStat}>
              <ThemedText style={[styles.statValue, { color: '#FFF' }]}>
                {MOCK_DATA.consumed}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: '#FFF', opacity: 0.8 }]}>
                consumed
              </ThemedText>
            </View>
            <View style={styles.calorieStat}>
              <ThemedText style={[styles.statValue, { color: '#FFF' }]}>
                {MOCK_DATA.dailyGoal}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: '#FFF', opacity: 0.8 }]}>
                daily goal
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </LinearGradient>

      {/* Section Divider */}
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Section: Water Tracking */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconSymbol name="drop.fill" size={22} color={colors.accent} />
            <ThemedText type="subtitle" style={{ color: colors.textPrimary }}>
              Water
            </ThemedText>
          </View>
          <ThemedText style={{ color: colors.textSecondary, fontSize: 13 }}>
            {MOCK_DATA.waterConsumed}/{MOCK_DATA.waterGoal}
          </ThemedText>
        </View>

        <View style={styles.waterContainer}>
          {Array.from({ length: MOCK_DATA.waterGoal }).map((_, index) => (
            <Pressable
              key={index}
              style={[
                styles.waterDrop,
                {
                  backgroundColor:
                    index < MOCK_DATA.waterConsumed ? colors.accent : colors.divider,
                  opacity: index < MOCK_DATA.waterConsumed ? 1 : 0.4,
                },
              ]}
            />
          ))}
        </View>
        <ThemedText style={[styles.waterText, { color: colors.textSecondary }]}>
          {MOCK_DATA.waterConsumed} of {MOCK_DATA.waterGoal} glasses
        </ThemedText>
      </ThemedView>

      {/* Section Divider */}
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Section: Meals */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconSymbol name="fork.knife" size={20} color={colors.accent} />
            <ThemedText type="subtitle" style={{ color: colors.textPrimary }}>
              Today Meals
            </ThemedText>
          </View>
        </View>

        <View style={styles.mealsList}>
          {MOCK_DATA.meals.map(meal => (
            <ThemedView
              key={meal.id}
              style={[
                styles.mealItem,
                { borderBottomColor: colors.divider },
                meal.id === MOCK_DATA.meals.length && { borderBottomWidth: 0 },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <IconSymbol name="leaf.fill" size={16} color={colors.accent} />
                <View>
                  <ThemedText type="defaultSemiBold" style={{ color: colors.textPrimary }}>
                    {meal.name}
                  </ThemedText>
                  <ThemedText style={[styles.mealTime, { color: colors.textSecondary }]}>
                    {meal.time}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={{ color: colors.textPrimary }}>
                {meal.calories} cal
              </ThemedText>
            </ThemedView>
          ))}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 10,
  },

  // Gradient Card (Calories)
  gradientCard: {
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 18,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientContent: {
    padding: 22,
    alignItems: 'center',
  },

  calorieCircleContainer: {
    marginVertical: 20,
  },
  calorieCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieRemaining: {
    fontSize: 48,
    fontWeight: '700',
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  calorieStat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '600' },
  statLabel: { fontSize: 13 },

  card: {
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  waterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 18,
  },
  waterDrop: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  waterText: {
    textAlign: 'center',
    fontSize: 14,
  },

  mealsList: { marginTop: 16 },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  mealTime: { fontSize: 12 },
  divider: {
    height: 1,
    marginVertical: 10,
    marginHorizontal: 16,
    opacity: 0.6,
  },
});
