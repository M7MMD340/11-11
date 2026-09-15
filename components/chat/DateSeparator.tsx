import { View, Text } from 'react-native';
import { chatStyles as s } from './styles';

function dayLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(d, today)) return 'اليوم';
  if (sameDay(d, yesterday)) return 'أمس';
  return d.toLocaleDateString('ar', { day: 'numeric', month: 'long' });
}

export function DateSeparator({ timestamp }: { timestamp: number }) {
  return (
    <View style={s.dateSeparator}>
      <View style={s.dateSeparatorPill}>
        <Text style={s.dateSeparatorText}>{dayLabel(timestamp)}</Text>
      </View>
    </View>
  );
}
