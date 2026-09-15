import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Screen, Title, Subtitle, Field, Button, ErrorText } from '../../components/ui';
import { signUp } from '../../lib/authActions';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    if (!name || !email || !password) {
      setError('عبّوا كل الحقول.');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور لازم تكون 6 أحرف أو أكثر.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
      router.replace('/(auth)/pair');
    } catch (e: any) {
      if (e?.code === 'auth/email-already-in-use') {
        setError('هذا البريد مسجّل مسبقاً، جرّب تسجيل الدخول.');
      } else {
        setError('تعذّر إنشاء الحساب. حاول مرة ثانية.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Screen style={{ justifyContent: 'center' }}>
          <Title>أهلاً فيكم 🌸</Title>
          <Subtitle>أنشئوا حسابكم للبدء</Subtitle>

          <ErrorText>{error}</ErrorText>
          <Field placeholder="الاسم" value={name} onChangeText={setName} />
          <Field
            placeholder="البريد الإلكتروني"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Field
            placeholder="كلمة المرور"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="إنشاء حساب" onPress={onSubmit} loading={loading} />
          <Link href="/(auth)/login" asChild>
            <Button title="عندك حساب؟ سجّل الدخول" onPress={() => {}} variant="ghost" />
          </Link>
        </Screen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
