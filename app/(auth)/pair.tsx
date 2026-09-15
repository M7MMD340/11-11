import { useState } from 'react';
import { Share, View, Text, StyleSheet } from 'react-native';
import { Screen, Title, Subtitle, Field, Button, ErrorText, Card } from '../../components/ui';
import { createCouple, joinCouple } from '../../lib/coupleActions';
import { logOut } from '../../lib/authActions';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../constants/theme';

export default function Pair() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [code, setCode] = useState('');
  const [myCode, setMyCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onCreate() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { inviteCode } = await createCouple(user.uid);
      setMyCode(inviteCode);
    } catch {
      setError('صار خطأ، حاول مرة ثانية.');
    } finally {
      setLoading(false);
    }
  }

  async function onJoin() {
    if (!user) return;
    if (!joinCode.trim()) {
      setError('اكتب رمز الدعوة.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await joinCouple(user.uid, joinCode);
    } catch (e: any) {
      setError(e.message ?? 'تعذّر الانضمام.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={{ justifyContent: 'center' }}>
      <Title>خلّيكم مع بعض 👫</Title>
      <Subtitle>اربطوا حسابكم بحساب شريككم عشان تشتركوا في كل شي</Subtitle>
      <ErrorText>{error}</ErrorText>

      {mode === 'choose' && (
        <>
          <Button title="أنا أول واحد يسجّل — أنشئ رمز دعوة" onPress={() => { setMode('create'); onCreate(); }} />
          <Button title="شريكي عنده رمز دعوة" onPress={() => setMode('join')} variant="secondary" />
          <Button title="تسجيل خروج" onPress={logOut} variant="ghost" />
        </>
      )}

      {mode === 'create' && (
        <Card style={{ alignItems: 'center', marginTop: spacing(2) }}>
          {loading || !myCode ? (
            <Text style={styles.hint}>جاري إنشاء الرمز…</Text>
          ) : (
            <>
              <Text style={styles.hint}>شاركوا هذا الرمز مع شريككم:</Text>
              <Text style={styles.code}>{myCode}</Text>
              <Button
                title="مشاركة الرمز"
                onPress={() => Share.share({ message: `انضم لي على مساحتنا! رمز الدعوة: ${myCode}` })}
                variant="secondary"
              />
              <Text style={styles.waiting}>بانتظار انضمام شريككم…</Text>
            </>
          )}
          <Button title="رجوع" onPress={() => setMode('choose')} variant="ghost" />
        </Card>
      )}

      {mode === 'join' && (
        <Card style={{ marginTop: spacing(2) }}>
          <Field
            placeholder="رمز الدعوة (مثال: AB12CD)"
            autoCapitalize="characters"
            value={joinCode}
            onChangeText={setJoinCode}
          />
          <Button title="انضمام" onPress={onJoin} loading={loading} />
          <Button title="رجوع" onPress={() => setMode('choose')} variant="ghost" />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { color: colors.muted, fontSize: 14, marginBottom: spacing(1) },
  code: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 6,
    color: colors.primary,
    marginBottom: spacing(2),
  },
  waiting: { color: colors.muted, marginTop: spacing(2), fontSize: 13 },
});
