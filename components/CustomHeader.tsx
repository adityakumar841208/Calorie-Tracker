import { useColorScheme } from '@/hooks/use-color-scheme';
import { Menu } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface CustomHeaderProps {
  title: string;
  onMenuPress: () => void;
}

export default function CustomHeader({ title, onMenuPress }: CustomHeaderProps) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.container,
        {
          
          backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
          borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        },
      ]}>
      <Text
        style={[
          styles.title,
          { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
        ]}>
        {title}
      </Text>
      <Pressable
        onPress={onMenuPress}
        style={({ pressed }) => [
          styles.menuButton,
          {
            opacity: pressed ? 0.7 : 1,
            backgroundColor: pressed
              ? colorScheme === 'dark'
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.04)'
              : 'transparent',
          },
        ]}>
        <Menu size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 70,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
