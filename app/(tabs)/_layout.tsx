import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const C = {
  primary: '#0F172A',
  surface: '#1E293B',
  accent: '#3B82F6',
  highlight: '#22D3EE',
  text: '#F8FAFC',
  gray: '#94A3B8',
};

function TabIcon({
  focused,
  name,
  label,
}: {
  focused: boolean;
  name: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;
  const glowAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 120,
        friction: 7,
      }),
      Animated.timing(glowAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={styles.tabItem}>
      <Animated.View
        style={[
          styles.iconWrapper,
          focused && styles.iconWrapperFocused,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Ionicons
          name={focused ? name : (`${name}-outline` as any)}
          size={focused ? 22 : 24}
          color={focused ? C.primary : C.gray}
        />
      </Animated.View>

      <Text
        style={[styles.label, focused ? styles.labelFocused : styles.labelUnfocused]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="home" label="Home" />
          ),
          tabBarButton: ({ delayLongPress, ...props }: any) => <TouchableOpacity {...props} activeOpacity={0.65} />,
        }}
      />
      <Tabs.Screen
        name="careers"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="briefcase" label="Careers" />
          ),
          tabBarButton: ({ delayLongPress, ...props }: any) => <TouchableOpacity {...props} activeOpacity={0.65} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="stats-chart" label="Progress" />
          ),
          tabBarButton: ({ delayLongPress, ...props }: any) => <TouchableOpacity {...props} activeOpacity={0.65} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="person" label="Profile" />
          ),
          tabBarButton: ({ delayLongPress, ...props }: any) => <TouchableOpacity {...props} activeOpacity={0.65} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: C.surface,
    height: 72,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
  },
  tabBarItem: {
    height: 72,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 6,
    gap: 3,
    minWidth: 60,
  },
  iconWrapper: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 2,
  },
  iconWrapperFocused: {
    backgroundColor: C.highlight,
    shadowColor: C.highlight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  labelFocused: {
    color: C.highlight,
    fontWeight: '700',
  },
  labelUnfocused: {
    color: C.gray,
  },
});