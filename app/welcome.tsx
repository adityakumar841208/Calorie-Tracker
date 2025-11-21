import { auth } from '@/lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Activity, Apple, Target, TrendingUp } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme
} from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const [checking, setChecking] = useState(true);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
        const user = auth.currentUser;

        if (user) {
          if (onboardingComplete === 'true') {
            router.replace('/(app)/home');
          } else {
            router.replace('/(onboarding)/goals');
          }
          return;
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!checking) {
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Shine animation loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(shineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [checking, fadeAnim, scaleAnim, slideAnim, shineAnim]);

  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  if (checking) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#0B0F14' : '#F7F9FB' }]}>
        <Activity size={40} color="#5B21B6" />
      </View>
    );
  }

  const shineTranslate = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const features = [
    { icon: Target, text: 'Track your daily calories', color: '#5B21B6' },
    { icon: TrendingUp, text: 'Achieve your goals', color: '#06B6D4' },
    { icon: Apple, text: 'Log meals easily', color: '#10B981' },
  ];

  return (
    <LinearGradient
      colors={isDark ? ['#0B0F14', '#1a1f2e', '#0B0F14'] : ['#F7F9FB', '#E0E7FF', '#F7F9FB']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo/Icon Area */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#5B21B6', '#7C3AED', '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Activity size={40} color="#FFF" strokeWidth={2.5} />
          </LinearGradient>
        </View>

        {/* Welcome Text with Shine Effect */}
        <View style={styles.titleContainer}>
          <View style={styles.titleWrapper}>
            <Text style={[styles.welcomeText, { color: isDark ? '#A5B4FC' : '#6366F1' }]}>
              Welcome to
            </Text>
            <View style={styles.shineContainer}>
              <LinearGradient
                colors={['#5B21B6', '#7C3AED', '#06B6D4', '#10B981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.titleGradient}
              >
                <Text style={styles.appTitle}>Calorie Tracker</Text>
              </LinearGradient>
              <Animated.View
                style={[
                  styles.shineOverlay,
                  {
                    transform: [{ translateX: shineTranslate }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.8)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shineGradient}
                />
              </Animated.View>
            </View>
          </View>

          <Text style={[styles.subtitle, { color: isDark ? '#8B98A8' : '#6B7280' }]}>
            Your journey to a healthier lifestyle starts here
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Animated.View
                key={index}
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-50, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <Icon size={20} color={feature.color} strokeWidth={2} />
                </View>
                <Text style={[styles.featureText, { color: isDark ? '#E6EEF8' : '#374151' }]}>
                  {feature.text}
                </Text>
              </Animated.View>
            );
          })}
        </View>

        {/* Get Started Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.getStartedButton,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <LinearGradient
              colors={['#5B21B6', '#7C3AED', '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Activity size={20} color="#FFF" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 24,
    position: 'relative',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: 1,
  },
  shineContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  titleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
  },
  shineGradient: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 32,
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  getStartedButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(91, 33, 182, 0.05)',
    zIndex: -1,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    zIndex: -1,
  },
});
