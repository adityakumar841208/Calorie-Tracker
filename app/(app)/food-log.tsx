import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';

const MEAL_TYPES = [
  { id: 'breakfast', name: 'Breakfast', icon: 'sunrise.fill' },
  { id: 'lunch', name: 'Lunch', icon: 'sun.max.fill' },
  { id: 'dinner', name: 'Dinner', icon: 'moon.fill' },
  { id: 'snack', name: 'Snack', icon: 'leaf.fill' },
];

const MOCK_FOODS = [
  { id: 1, name: 'Banana', calories: 105, serving: '1 medium' },
  { id: 2, name: 'Chicken Breast', calories: 165, serving: '100g' },
  { id: 3, name: 'Brown Rice', calories: 216, serving: '1 cup cooked' },
  { id: 4, name: 'Greek Yogurt', calories: 100, serving: '100g' },
  { id: 5, name: 'Almonds', calories: 164, serving: '28g' },
];

export default function FoodLogScreen() {
  const [selectedMeal, setSelectedMeal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#0B0B0C' : '#F8F9FB',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '#2C2C2E' : '#E5E5E7',
    textPrimary: isDark ? '#F3F3F3' : '#111',
    textSecondary: isDark ? '#A5A5A7' : '#666',
    accent: '#007AFF',
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  const filteredFoods = MOCK_FOODS.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={[styles.header]}>
          <ThemedText type="title" style={[styles.title, { color: colors.textPrimary }]}>
            Log Food
          </ThemedText>
        </ThemedView>

        {/* Meal Type Selection */}
        <ThemedView style={styles.mealTypes}>
          {MEAL_TYPES.map((meal) => {
            const selected = selectedMeal === meal.id;
            return (
              <Pressable
                key={meal.id}
                onPress={() => setSelectedMeal(meal.id)}
                style={[
                  styles.mealTypeButton,
                  {
                    backgroundColor: selected ? colors.accent : colors.card,
                    borderColor: selected ? colors.accent : colors.border,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <IconSymbol
                  name={meal.icon}
                  size={26}
                  color={selected ? '#FFF' : colors.accent}
                />
                <ThemedText
                  style={[
                    styles.mealTypeText,
                    { color: selected ? '#FFF' : colors.textPrimary },
                  ]}
                >
                  {meal.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </ThemedView>

        {/* Search Bar */}
        <ThemedView
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search foods..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </ThemedView>

        {/* Food List */}
        <ThemedView style={[styles.foodList, { backgroundColor: colors.card }]}>
          {filteredFoods.map((food, index) => (
            <Pressable
              key={food.id}
              style={[
                styles.foodItem,
                {
                  borderBottomColor:
                    index !== filteredFoods.length - 1 ? colors.border : 'transparent',
                },
              ]}
            >
              <ThemedView>
                <ThemedText
                  type="defaultSemiBold"
                  style={{ color: colors.textPrimary }}
                >
                  {food.name}
                </ThemedText>
                <ThemedText style={[styles.servingText, { color: colors.textSecondary }]}>
                  {food.serving}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.calorieContainer}>
                <ThemedText style={{ color: colors.textPrimary }}>
                  {food.calories}
                </ThemedText>
                <ThemedText style={[styles.calorieLabel, { color: colors.textSecondary }]}>
                  cal
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>

        {/* Quick Add Button */}
        <ThemedView style={styles.quickAddContainer}>
          <Pressable style={[styles.quickAddButton, { backgroundColor: colors.accent }]}>
            <IconSymbol name="plus.circle.fill" size={24} color="#fff" />
            <ThemedText style={styles.quickAddText}>Quick Add Custom Food</ThemedText>
          </Pressable>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },

  header: {
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },

  mealTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  mealTypeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginHorizontal: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },
  mealTypeText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },

  foodList: {
    borderRadius: 14,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  servingText: {
    fontSize: 13,
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  calorieLabel: {
    fontSize: 12,
  },

  quickAddContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
  },
  quickAddText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
