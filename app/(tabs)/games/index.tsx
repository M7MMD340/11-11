import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Title, Subtitle } from '../../../components/ui';
import { colors, spacing } from '../../../constants/theme';

const GAMES = [
  {
    key: 'truth-or-dare',
    title: 'صراحة ولا تحدي',
    desc: 'أسئلة وتحديات حلوة بينكم',
    icon: 'chatbubbles' as const,
    color: '#E8607A',
  },
  {
    key: 'pictionary',
    title: 'ارسم وخمّن',
    desc: 'واحد يرسم والثاني يخمّن',
    icon: 'brush' as const,
    color: '#7C6BC4',
  },
  {
    key: 'quiz',
    title: 'كم تعرفني',
    desc: 'شوفوا كم تعرفون بعض',
    icon: 'help-circle' as const,
    color: '#F6B33C',
  },
];

export default function GamesHub() {
  const router = useRouter();
  return (
    <Screen>
      <Title>ألعابنا 🎮</Title>
      <Subtitle>اختاروا لعبة تلعبونها مع بعض الحين</Subtitle>
      <View style={{ gap: spacing(1.5) }}>
        {GAMES.map((g) => (
          <Pressable
            key={g.key}
            style={styles.card}
            onPress={() => router.push(`/(tabs)/games/${g.key}` as any)}
          >
            <View style={[styles.iconWrap, { backgroundColor: g.color + '22' }]}>
              <Ionicons name={g.icon} size={26} color={g.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{g.title}</Text>
              <Text style={styles.cardDesc}>{g.desc}</Text>
            </View>
            <Ionicons name="chevron-back" size={20} color={colors.muted} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.border,
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
