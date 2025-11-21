import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View, Text } from 'react-native';
import { router } from 'expo-router';
import { Equal, TrendingDown, TrendingUp } from 'lucide-react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const GOALS = [
  { id: 'weight-loss', title: 'Weight Loss', description: 'Lose fat with a gentle calorie deficit', Icon: TrendingDown },
  { id: 'weight-gain', title: 'Weight Gain', description: 'Build muscle & gain strength', Icon: TrendingUp },
  { id: 'maintain', title: 'Maintain', description: 'Keep your current weight with balance', Icon: Equal },
];

export default function ModernGoalsScreen() {
  const [selected, setSelected] = useState('');
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const colors = {
    bg: dark ? '#0B0F14' : '#F7F9FB',
    card: dark ? '#0F1720' : '#FFFFFF',
    muted: dark ? '#8B98A8' : '#6B7280',
    accent: '#5B21B6',
    accent2: '#06B6D4',
    border: dark ? 'rgba(255,255,255,0.04)' : 'rgba(2,6,23,0.04)'
  };

  function onContinue() {
    if (!selected) return;
    router.push({ pathname: '/(onboarding)/target', params: { goal: selected } });
  }

  return (
    <ThemedView style={[styles.root, { backgroundColor: colors.bg }]}> 
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: dark ? '#F8FAFC' : '#071025' }]}>Select your goal</ThemedText>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Pick one to personalise your plan.</Text>
        </View>

        <View style={styles.grid}>
          {GOALS.map((g) => {
            const active = selected === g.id;
            const Icon = g.Icon;
            return (
              <Pressable
                key={g.id}
                onPress={() => setSelected(g.id)}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: active ? `linear-gradient(90deg, ${colors.accent}, ${colors.accent2})` : colors.card,
                    borderColor: active ? 'transparent' : colors.border,
                    transform: [{ scale: pressed ? 0.985 : 1 }]
                  }
                ]}
                android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
              >
                <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                  <Icon size={22} color={active ? '#FFF' : colors.accent} strokeWidth={2.2} />
                </View>

                <ThemedText type="subtitle" style={[styles.cardTitle, { color: active ? '#FFF' : dark ? '#E6EEF8' : '#071025' }]}>{g.title}</ThemedText>
                <Text style={[styles.cardText, { color: active ? 'rgba(255,255,255,0.9)' : colors.muted }]}>{g.description}</Text>

                {active && <View style={styles.check} />}
              </Pressable>
            );
          })}
        </View>

      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: dark ? '#071225' : '#FFFFFF' }]}> 
        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [
            styles.cta,
            { opacity: selected ? 1 : 0.6, transform: [{ scale: pressed ? 0.995 : 1 }] }
          ]}
          disabled={!selected}
        >
          <Text style={styles.ctaText}>Continue</Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { paddingHorizontal: 22, paddingTop: 70},
  header: { marginBottom: 50, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', opacity: 0.9 },

  grid: { gap: 14 },
  card: {
    padding: 0,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 6,
    minHeight: 122,
  },
  iconWrap: {
    width: 56,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,18,32,0.04)'
  },
  iconWrapActive: { backgroundColor: 'rgba(255,255,255,0.12)' },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  cardText: { fontSize: 13, textAlign: 'center', lineHeight: 18, maxWidth: 320 },

  check: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981'
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  cta: {
    height: 38,
    borderRadius: 12,
    backgroundColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ctaText: { color: '#FFF', fontWeight: '700', fontSize: 16, paddingHorizontal: 5 }
});
