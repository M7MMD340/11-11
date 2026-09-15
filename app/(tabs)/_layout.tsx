import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { ColorValue, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors, shadow, radius } from '../../constants/theme';

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
  const pillOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.08 : 1, { damping: 10, stiffness: 220 });
    pillOpacity.value = withTiming(focused ? 1 : 0, { duration: 180 });
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const pillStyle = useAnimatedStyle(() => ({ opacity: pillOpacity.value }));

  return (
    <View style={{ width: 44, height: 34, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 40,
            height: 34,
            borderRadius: radius.pill,
            backgroundColor: colors.primary,
          },
          pillStyle,
        ]}
      />
      <Animated.View style={iconStyle}>
        <Ionicons name={name} color={focused ? '#fff' : color} size={size} />
      </Animated.View>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: insets.bottom + 12,
          height: 62,
          borderRadius: radius.pill,
          borderTopWidth: 0,
          backgroundColor: colors.card,
          paddingHorizontal: 6,
          ...shadow.lift,
        },
        tabBarItemStyle: { paddingTop: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'دردشتنا',
          tabBarIcon: (p) => <AnimatedTabIcon name="chatbubble-ellipses" {...p} />,
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
