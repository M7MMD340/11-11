import { useEffect, useState } from 'react';
import { View, Pressable, LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, shadow, radius } from '../../constants/theme';

type TabBarRoute = { key: string; name: string };
type TabBarProps = {
  state: { index: number; routes: TabBarRoute[] };
  descriptors: Record<string, { options: Record<string, any> }>;
  navigation: {
    emit: (e: any) => any;
    navigate: (name: string) => void;
  };
  insets: { bottom: number };
};

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'chatbubble-ellipses',
  world: 'home',
  games: 'game-controller',
  ideas: 'bulb',
  profile: 'person-circle',
};

export function CustomTabBar({ state, descriptors, navigation, insets }: TabBarProps) {
  const focusedOptions = descriptors[state.routes[state.index].key]?.options;
  const [barWidth, setBarWidth] = useState(0);

  const itemWidth = state.routes.length ? barWidth / state.routes.length : 0;
  const blobX = useSharedValue(0);
  const stretch = useSharedValue(1);

  useEffect(() => {
    if (!itemWidth) return;
    const target = state.index * itemWidth;
    // A gooey "melt" toward the newly selected tab: stretch wide mid-slide,
    // then settle back into a round blob — the app's one signature motion,
    // reused here instead of a plain color fade.
    blobX.value = withSpring(target, { damping: 16, stiffness: 170 });
    stretch.value = withSequence(
      withTiming(1.55, { duration: 140 }),
      withSpring(1, { damping: 8, stiffness: 160 }),
    );
  }, [state.index, itemWidth]);

  const blobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: blobX.value }, { scaleX: stretch.value }],
  }));

  function onLayout(e: LayoutChangeEvent) {
    setBarWidth(e.nativeEvent.layout.width);
  }

  // Hidden entirely while a screen (e.g. the chat camera) takes over the viewport.
  if (focusedOptions?.tabBarStyle && (focusedOptions.tabBarStyle as any).display === 'none') {
    return null;
  }

  return (
    <View style={[styles.wrap, { bottom: insets.bottom + 12 }]} pointerEvents="box-none">
      <View style={styles.bar} onLayout={onLayout}>
        {itemWidth > 0 && (
          <Animated.View style={[styles.blob, { width: itemWidth - 12 }, blobStyle]} />
        )}
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          function onPress() {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.item}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={String(descriptors[route.key]?.options.title ?? route.name)}
            >
              <Ionicons
                name={ICONS[route.name] ?? 'ellipse'}
                size={23}
                color={isFocused ? '#fff' : colors.muted}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = {
  wrap: {
    position: 'absolute' as const,
    left: 20,
    right: 20,
    bottom: 0,
  },
  bar: {
    flexDirection: 'row' as const,
    height: 62,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    alignItems: 'center' as const,
    overflow: 'hidden' as const,
    ...shadow.lift,
  },
  blob: {
    position: 'absolute' as const,
    left: 6,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  item: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: '100%' as const,
  },
};
