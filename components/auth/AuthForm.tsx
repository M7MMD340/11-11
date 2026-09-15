import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Field, Button, ErrorText, Logo, SegmentedTabs } from '../ui';
import { signUp, logIn } from '../../lib/authActions';
import { APP_NAME, colors, gradients, radius, shadow, spacing } from '../../constants/theme';

type Mode = 'login' | 'signup';

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setError(null);
    router.replace(next === 'login' ? '/(auth)/login' : '/(auth)/signup');
  }

  async function onSubmit() {
    setError(null);
    if (mode === 'signup') {
      if (!name || !email || !password) {
        setError('عبّوا كل الحقول.');
        return;
      }
      if (password.length < 6) {
        setError('كلمة المرور لازم تكون 6 أحرف أو أكثر.');
        return;
      }
    } else if (!email || !password) {
      setError('عبّي البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password, name);
        router.replace('/(auth)/pair');
      } else {
        await logIn(email, password);
      }
    } catch (e: any) {
      if (e?.code === 'auth/email-already-in-use') {
        setError('هذا البريد مسجّل مسبقاً، جرّب تسجيل الدخول.');
      } else if (mode === 'login') {
        setError('تعذّر تسجيل الدخول. تأكد من البيانات.');
      } else {
        setError('تعذّر إنشاء الحساب. حاول مرة ثانية.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing(4) }]}
      >
        <Logo size={68} />
        <Text style={styles.heroTitle}>{APP_NAME}</Text>
        <Text style={styles.heroTagline}>مساحتكم الخاصة، بس بينكم اثنين</Text>
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <SegmentedTabs
              options={[
                { key: 'login', label: 'دخول' },
                { key: 'signup', label: 'حساب جديد' },
              ]}
              value={mode}
              onChange={(k) => switchMode(k as Mode)}
            />

            <View style={{ height: spacing(3) }} />
            <ErrorText>{error}</ErrorText>

            {mode === 'signup' && (
              <Field placeholder="الاسم" value={name} onChangeText={setName} accessibilityLabel="الاسم" />
            )}
            <Field
              placeholder="البريد الإلكتروني"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              accessibilityLabel="البريد الإلكتروني"
            />
            <Field
              placeholder="كلمة المرور"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              accessibilityLabel="كلمة المرور"
            />

            <Button title={mode === 'login' ? 'دخول' : 'إنشاء حساب'} onPress={onSubmit} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingBottom: spacing(7),
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing(2),
  },
  heroTagline: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: spacing(0.5),
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg + 6,
    borderTopRightRadius: radius.lg + 6,
    marginTop: -28,
    padding: spacing(3),
    ...shadow.lift,
  },
});
