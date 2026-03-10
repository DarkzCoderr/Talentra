import { AnimatedCard } from '@/components/AnimatedCard';
import { COLORS } from '@/constants/colors';
import { AuthService } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const loadUser = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const renderProfileCard = () => (
    <AnimatedCard delay={100} style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.profileStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Member Since</Text>
          <Text style={styles.statValue}>
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '18-01-2026'}
          </Text>
        </View>
      </View>
    </AnimatedCard>
  );

  const renderMenuCard = (title: string, items: Array<{ icon: string; label: string; onPress?: () => void }>) => (
    <AnimatedCard delay={200} style={styles.menuCard}>
      <Text style={styles.menuTitle}>{title}</Text>
      <View style={styles.menuItems}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Ionicons name={item.icon as any} size={20} color={COLORS.gray} />
            <Text style={styles.menuItemText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
          </TouchableOpacity>
        ))}
      </View>
    </AnimatedCard>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Animated.View
            style={[
              styles.loadingDot,
              { backgroundColor: COLORS.accent }
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              { backgroundColor: COLORS.secondary, marginLeft: 10 }
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              { backgroundColor: COLORS.primary, marginLeft: 10 }
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]} >
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileCard()}

        {renderMenuCard('Account', [
          { icon: 'person-outline', label: 'Edit Profile', onPress: () => router.push('/profile/edit') },
          { icon: 'settings-outline', label: 'Preferences', onPress: () => router.push('/profile/preferences') },
          { icon: 'notifications-outline', label: 'Notifications', onPress: () => router.push('/profile/notifications') },
        ])}

        {renderMenuCard('Support', [
          { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => router.push('/profile/support') },
          { icon: 'document-text-outline', label: 'Terms & Privacy', onPress: () => router.push('/profile/policy') },
          { icon: 'information-circle-outline', label: 'About', onPress: () => router.push('/profile/about') },
        ])}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.accent,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.gray,
  },
  profileStats: {
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuCard: {
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  menuItems: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    marginTop: 24,
    marginBottom: 100,
  },
  logoutBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
