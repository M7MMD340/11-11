import { View, Text, StyleSheet } from 'react-native';
import { Screen, GradientHeader, Card, Button, Logo } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../lib/authActions';
import { colors, spacing } from '../../constants/theme';

export default function Profile() {
  const { profile, couple, user } = useAuth();

  return (
    <Screen>
      <GradientHeader title="حسابي 👤" subtitle="بياناتكم ورمز الدعوة" />
      <View style={{ alignItems: 'center', marginBottom: spacing(2) }}>
        <Logo size={64} />
      </View>
      <Card style={{ marginBottom: spacing(2) }}>
        <Text style={styles.label}>الاسم</Text>
        <Text style={styles.value}>{profile?.displayName}</Text>
        <Text style={styles.label}>البريد الإلكتروني</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </Card>
      <Card style={{ marginBottom: spacing(2) }}>
        <Text style={styles.label}>رمز الدعوة الخاص بكم</Text>
        <Text style={[styles.value, { fontSize: 22, letterSpacing: 3, color: colors.primary }]}>
          {couple?.inviteCode}
        </Text>
      </Card>
      <Button title="تسجيل خروج" onPress={logOut} variant="ghost" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, marginTop: spacing(1), textAlign: 'right' },
  value: { color: colors.text, fontSize: 16, fontWeight: '600', textAlign: 'right' },
});
