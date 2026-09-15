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
  if (variant === 'primary') {
    return (
      <Pressable onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
        <LinearGradient
          colors={gradients.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, (disabled || loading) && { opacity: 0.55 }]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{title}</Text>}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        (disabled || loading) && { opacity: 0.55 },
        pressed && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.buttonText, variant === 'ghost' && { color: colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, style]}>{children}</View>;
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
      style={[
        styles.logo,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.logoText, { fontSize: size * 0.34 }]}>{APP_SHORT_NAME}</Text>
      <Text style={[styles.logoSub, { fontSize: size * 0.16 }]}>{APP_DATE}</Text>
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
  logoText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1,
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
});
