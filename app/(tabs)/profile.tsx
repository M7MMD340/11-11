import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Screen, GradientHeader, usePressScale } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../lib/authActions';
import { colors, spacing, radius, shadow } from '../../constants/theme';

function Row({
  icon,
  iconColor,
  label,
  value,
  onPress,
  isLast,
  trailing,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.row, !isLast && styles.rowDivider]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={icon} size={17} color={iconColor} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flex: 1 }} />
      {trailing ?? (value ? <Text style={styles.rowValue}>{value}</Text> : null)}
    </Pressable>
  );
}

export default function Profile() {
  const { profile, couple, partnerProfile, user } = useAuth();
  const [copied, setCopied] = useState(false);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  async function copyCode() {
    if (!couple?.inviteCode) return;
    try {
      await Clipboard.setStringAsync(couple.inviteCode);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const initial = (profile?.displayName ?? '؟').trim().charAt(0);

  return (
    <Screen>
      <GradientHeader title="حسابي" subtitle="بياناتكم ورمز الدعوة" />

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{profile?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <Text style={styles.groupLabel}>معلومات الحساب</Text>
      <View style={styles.group}>
        <Row
          icon="heart"
          iconColor={colors.primary}
          label="شريككم"
          value={partnerProfile?.displayName ?? 'بانتظار الانضمام'}
        />
        <Row
          icon="key"
          iconColor={colors.accent}
          label="رمز الدعوة"
          isLast
          trailing={
            <Animated.View style={animatedStyle}>
              <Pressable
                onPress={copyCode}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={styles.codePill}
                accessibilityRole="button"
                accessibilityLabel="نسخ رمز الدعوة"
              >
                {copied ? (
                  <Animated.Text entering={FadeIn.duration(150)} style={styles.codeCopied}>
                    تم النسخ ✓
                  </Animated.Text>
                ) : (
                  <>
                    <Text style={styles.codeText}>{couple?.inviteCode}</Text>
                    <Ionicons name="copy-outline" size={14} color={colors.muted} />
                  </>
                )}
              </Pressable>
            </Animated.View>
          }
        />
      </View>

      <Text style={styles.groupLabel}>عام</Text>
      <View style={styles.group}>
        <Row icon="log-out-outline" iconColor={colors.danger} label="تسجيل خروج" isLast onPress={logOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', marginBottom: spacing(3.5) },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.cardAlt,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(1.5),
  },
  avatarText: { color: colors.primary, fontSize: 30, fontWeight: '800' },
  name: { color: colors.text, fontSize: 19, fontWeight: '800' },
  email: { color: colors.muted, fontSize: 13, marginTop: 2 },
  groupLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing(1),
    marginTop: spacing(1),
    textAlign: 'right',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  group: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing(2.5),
    ...shadow.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.25),
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.75),
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { color: colors.text, fontSize: 14.5, fontWeight: '600' },
  rowValue: { color: colors.muted, fontSize: 14 },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.75),
    minWidth: 92,
    justifyContent: 'center',
  },
  codeText: { color: colors.text, fontWeight: '700', fontSize: 13, letterSpacing: 1 },
  codeCopied: { color: colors.success, fontWeight: '700', fontSize: 12 },
});
