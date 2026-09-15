import { Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, GradientHeader, AnimatedCard } from '../../../components/ui';
import { colors, spacing, radius } from '../../../constants/theme';

const GAMES = [
  {
    key: 'truth-or-dare',
    title: 'صراحة ولا تحدي',
    desc: 'أسئلة وتحديات حلوة بينكم',
    icon: 'chatbubbles' as const,
    color: colors.primary,
  },
  {
    key: 'pictionary',
    title: 'ارسم وخمّن',
    desc: 'واحد يرسم والثاني يخمّن',
    icon: 'brush' as const,
    color: colors.secondaryLight,
  },
  {
    key: 'quiz',
    title: 'كم تعرفني',
    desc: 'شوفوا كم تعرفون بعض',
    icon: 'help-circle' as const,
    color: colors.accent,
  },
];

export default function GamesHub() {
  const router = useRouter();
  return (
    <Screen>
      <GradientHeader title="ألعابنا 🎮" subtitle="اختاروا لعبة تلعبونها مع بعض الحين" />
      <View style={{ gap: spacing(1.5) }}>
        {GAMES.map((g, i) => (
          <AnimatedCard
            key={g.key}
            index={i}
            onPress={() => router.push(`/(tabs)/games/${g.key}` as any)}
            style={styles.card}
          >
            <View style={[styles.iconWrap, { backgroundColor: g.color + '22' }]}>
              <Ionicons name={g.icon} size={26} color={g.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{g.title}</Text>
              <Text style={styles.cardDesc}>{g.desc}</Text>
            </View>
            <Ionicons name="chevron-back" size={20} color={colors.muted} />
          </AnimatedCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontWeight: '800', fontSize: 16, color: colors.text, textAlign: 'right' },
  cardDesc: { color: colors.muted, fontSize: 13, textAlign: 'right', marginTop: 2 },
});
