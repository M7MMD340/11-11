import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/navigation/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'دردشتنا' }} />
      <Tabs.Screen name="world" options={{ title: 'بيتنا' }} />
      <Tabs.Screen name="games" options={{ title: 'ألعاب' }} />
      <Tabs.Screen name="ideas" options={{ title: 'أفكارنا' }} />
      <Tabs.Screen name="profile" options={{ title: 'حسابي' }} />
    </Tabs>
  );
}
