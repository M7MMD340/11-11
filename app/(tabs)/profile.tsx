import { View, Text, StyleSheet } from 'react-native';
import { Screen, Title, Card, Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../lib/authActions';
import { colors, spacing } from '../../constants/theme';

export default function Profile() {
  const { profile, couple, user } = useAuth();

  return (
    <Screen>
      <Title>حسابي 👤</Title>
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
        <Text style={styles.label}>عدد النقاط المشتركة</Text>
        <Text style={styles.value}>{couple?.coins ?? 0} 🪙</Text>
      </Card>
      <Button title="تسجيل خروج" onPress={logOut} variant="ghost" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, marginTop: spacing(1), textAlign: 'right' },
  value: { color: colors.text, fontSize: 16, fontWeight: '600', textAlign: 'right' },
});
