import { Text, View } from 'react-native';
import { GradientHeader } from '../ui';
import { chatStyles as s } from './styles';

export function ChatHeader({ partnerName, streak }: { partnerName: string; streak: number }) {
  const subtitle = streak > 0 ? `🔥 ${streak} ${streak === 1 ? 'يوم متتالي' : 'أيام متتالية'}` : 'ابدأوا أول محادثة اليوم!';

  return (
    <GradientHeader
      title={partnerName}
      subtitle={subtitle}
      right={
        <View style={s.avatarCircle}>
          <Text style={s.avatarInitial}>{partnerName.trim().charAt(0) || '💬'}</Text>
        </View>
      }
    />
  );
}
