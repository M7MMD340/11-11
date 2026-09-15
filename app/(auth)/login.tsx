import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Screen, Title, Subtitle, Field, Button, ErrorText, Logo } from '../../components/ui';
import { logIn } from '../../lib/authActions';
import { APP_NAME, spacing } from '../../constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    if (!email || !password) {
      setError('عبّي البريد الإلكتروني وكلمة المرور.');
      return;
    }
    setLoading(true);
    try {
      await logIn(email, password);
    } catch (e: any) {
      setError('تعذّر تسجيل الدخول. تأكد من البيانات.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Screen style={{ justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: spacing(3) }}>
            <Logo />
          </View>
          <Title>{APP_NAME}</Title>
          <Subtitle>سجّلوا الدخول لعالمكم الخاص</Subtitle>

          <ErrorText>{error}</ErrorText>
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
          <Button title="دخول" onPress={onSubmit} loading={loading} />
          <Link href="/(auth)/signup" asChild>
            <Button title="ما عندك حساب؟ أنشئوا واحد" onPress={() => {}} variant="ghost" />
          </Link>
        </Screen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
