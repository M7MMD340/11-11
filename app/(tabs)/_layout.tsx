import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, shadow } from '../../constants/theme';

function AnimatedTabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: ColorValue;
  size: number;
  focused: boolean;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.18 : 1, { damping: 10, stiffness: 220 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} color={color} size={size} />
    </Animated.View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontWeight: '600', fontSize: 11 },
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.card,
          height: 64,
          paddingTop: 6,
          paddingBottom: 10,
          ...shadow.lift,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'لحظاتنا',
          tabBarIcon: (p) => <AnimatedTabIcon name="camera" {...p} />,
        }}
      />
      <Tabs.Screen
        name="world"
        options={{
          title: 'بيتنا',
          tabBarIcon: (p) => <AnimatedTabIcon name="home" {...p} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'ألعاب',
          tabBarIcon: (p) => <AnimatedTabIcon name="game-controller" {...p} />,
        }}
      />
      <Tabs.Screen
        name="ideas"
        options={{
          title: 'أفكارنا',
          tabBarIcon: (p) => <AnimatedTabIcon name="bulb" {...p} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'حسابي',
          tabBarIcon: (p) => <AnimatedTabIcon name="person-circle" {...p} />,
        }}
      />
    </Tabs>
  );
}
