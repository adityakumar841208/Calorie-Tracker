import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

const MEAL_TYPES = [
  { id: 'breakfast', name: 'Breakfast', icon: 'sun.max.fill' },
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

  const filteredFoods = MOCK_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Log Food</ThemedText>
      </ThemedView>

      {/* Meal Type Selection */}
      <ThemedView style={styles.mealTypes}>
        {MEAL_TYPES.map(meal => (
          <Pressable
            key={meal.id}
            style={[
              styles.mealTypeButton,
              selectedMeal === meal.id && styles.mealTypeButtonSelected,
            ]}
            onPress={() => setSelectedMeal(meal.id)}
          >
            <IconSymbol
              name={meal.icon}
              size={24}
              color={selectedMeal === meal.id ? '#fff' : '#007AFF'}
            />
            <ThemedText
              style={[
                styles.mealTypeText,
                selectedMeal === meal.id && styles.mealTypeTextSelected,
              ]}
            >
              {meal.name}
            </ThemedText>
          </Pressable>
        ))}
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </ThemedView>

      {/* Food List */}
      <ThemedView style={styles.foodList}>
        {filteredFoods.map(food => (
          <Pressable key={food.id} style={styles.foodItem}>
            <ThemedView>
              <ThemedText type="defaultSemiBold">{food.name}</ThemedText>
              <ThemedText style={styles.servingText}>{food.serving}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.calorieContainer}>
              <ThemedText>{food.calories}</ThemedText>
              <ThemedText style={styles.calorieLabel}>cal</ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </ThemedView>

      {/* Quick Add Button */}
      <ThemedView style={styles.quickAddContainer}>
        <Pressable style={styles.quickAddButton}>
          <IconSymbol name="plus.circle.fill" size={24} color="#fff" />
          <ThemedText style={styles.quickAddText}>Quick Add Custom Food</ThemedText>
        </Pressable>
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
  mealTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mealTypeButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  mealTypeButtonSelected: {
    backgroundColor: '#007AFF',
  },
  mealTypeText: {
    marginTop: 4,
    fontSize: 12,
    color: '#007AFF',
  },
  mealTypeTextSelected: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  foodList: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  servingText: {
    fontSize: 12,
    color: '#666',
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  calorieLabel: {
    fontSize: 12,
    color: '#666',
  },
  quickAddContainer: {
    padding: 16,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  quickAddText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});