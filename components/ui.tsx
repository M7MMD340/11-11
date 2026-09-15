import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, FadeInDown } from 'react-native-reanimated';
import { colors, spacing, shadow, radius, gradients, APP_SHORT_NAME, APP_DATE } from '../constants/theme';

export function Screen({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Field(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.muted} style={styles.field} {...props} />;
}

export function usePressScale(disabled?: boolean) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return {
    animatedStyle,
    onPressIn: () => {
      if (!disabled) scale.value = withSpring(0.95, { damping: 16, stiffness: 340 });
    },
    onPressOut: () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 220 });
    },
  };
}

export function Button({
  title,
  onPress,
  loading,
  variant = 'primary',
  disabled,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}) {
  const isDisabled = disabled || loading;
  const { animatedStyle, onPressIn, onPressOut } = usePressScale(isDisabled);

  if (variant === 'primary') {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} disabled={isDisabled}>
          <LinearGradient
            colors={gradients.gold}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, isDisabled && { opacity: 0.55 }]}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{title}</Text>}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        style={[
          styles.button,
          variant === 'secondary' && styles.buttonSecondary,
          variant === 'ghost' && styles.buttonGhost,
          isDisabled && { opacity: 0.55 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'ghost' ? colors.primary : '#fff'} />
        ) : (
          <Text style={[styles.buttonText, variant === 'ghost' && { color: colors.primary }]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Pressable card that fades/slides in on mount (staggered via `index`) and scales on press. */
export function AnimatedCard({
  children,
  onPress,
  index = 0,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  index?: number;
  style?: any;
}) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(16)} style={animatedStyle}>
      <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={[styles.card, style]}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function ErrorText({ children }: { children?: string | null }) {
  if (!children) return null;
  return <Text style={styles.error}>{children}</Text>;
}

export function Logo({ size = 76 }: { size?: number }) {
  return (
    <LinearGradient
      colors={gradients.hero}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.logo, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View style={styles.logoRow}>
        <Text style={[styles.logoText, { fontSize: size * 0.32 }]}>{APP_SHORT_NAME[0]}</Text>
        <Text style={[styles.logoHeart, { fontSize: size * 0.26 }]}>♥</Text>
        <Text style={[styles.logoText, { fontSize: size * 0.32 }]}>{APP_SHORT_NAME[APP_SHORT_NAME.length - 1]}</Text>
      </View>
      <Text style={[styles.logoSub, { fontSize: size * 0.15 }]}>{APP_DATE}</Text>
    </LinearGradient>
  );
}

export function GradientHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <LinearGradient
      colors={gradients.hero}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientHeader}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.gradientHeaderTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.gradientHeaderSubtitle}>{subtitle}</Text>}
      </View>
      {right}
    </LinearGradient>
  );
}

/** Segmented control with an animated sliding pill indicator. */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  const activeIndex = Math.max(0, options.findIndex((o) => o.key === value));
  const indicatorX = useSharedValue(activeIndex);

  React.useEffect(() => {
    indicatorX.value = withSpring(activeIndex, { damping: 18, stiffness: 220 });
  }, [activeIndex]);

  const indicatorStyle = useAnimatedStyle(() => {
    const widthPct = 100 / options.length;
    return {
      left: `${indicatorX.value * widthPct}%`,
      width: `${widthPct}%`,
    };
  });

  return (
    <View style={styles.segmented}>
      <Animated.View style={[styles.segmentedIndicator, indicatorStyle]} />
      {options.map((o) => (
        <Pressable key={o.key} style={styles.segmentedItem} onPress={() => onChange(o.key)}>
          <Text style={[styles.segmentedLabel, value === o.key && styles.segmentedLabelActive]}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing(3),
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(1),
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: spacing(3),
  },
  field: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing(1.5),
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing(1.75),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing(1),
    backgroundColor: colors.primary,
    ...shadow.soft,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing(1),
    fontSize: 13,
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.lift,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: '800',
  },
  logoHeart: {
    color: colors.accent,
    marginHorizontal: 3,
  },
  logoSub: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 2,
  },
  gradientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(2.5),
    paddingVertical: spacing(2.5),
    borderRadius: radius.lg,
    marginBottom: spacing(2.5),
    ...shadow.lift,
  },
  gradientHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'right',
  },
  gradientHeaderSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'right',
    marginTop: 4,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  segmentedIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  segmentedItem: {
    flex: 1,
    paddingVertical: spacing(1.25),
    alignItems: 'center',
    zIndex: 1,
  },
  segmentedLabel: { color: colors.muted, fontWeight: '600', fontSize: 13 },
  segmentedLabelActive: { color: '#fff' },
});
