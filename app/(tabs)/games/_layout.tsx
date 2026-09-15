import { Stack } from 'expo-router';
import { colors } from '../../../constants/theme';

export default function GamesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="truth-or-dare" options={{ title: 'صراحة ولا تحدي' }} />
      <Stack.Screen name="quiz" options={{ title: 'كم تعرفني' }} />
      <Stack.Screen name="pictionary" options={{ title: 'ارسم وخمّن' }} />
    </Stack>
  );
}
