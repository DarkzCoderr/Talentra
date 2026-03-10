import { COLORS } from '@/constants/colors';
import { AuthService } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    checkAuthAndOnboarding();
  }, []);

  const checkAuthAndOnboarding = async () => {
    try {
      const user = await AuthService.getCurrentUser();

      if (!user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const userProfile = await DatabaseService.getUserProfile(user.$id);
        const onboardingDone = !!(userProfile && userProfile.interests && userProfile.interests.length > 0);
        setHasCompletedOnboarding(onboardingDone);
      } catch {
        setHasCompletedOnboarding(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/talentra-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Talentra</Text>
        <Text style={styles.tagline}>Your Path to the Right Career</Text>
        <ActivityIndicator size="large" color={COLORS.highlight} style={styles.spinner} />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/auth/login" />;
  if (!hasCompletedOnboarding) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    marginBottom: 4,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  spinner: {
    marginTop: 32,
  },
});
