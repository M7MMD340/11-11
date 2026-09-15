import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { Screen, GradientHeader, usePressScale } from '../../../components/ui';
import { colors, spacing, radius, shadow } from '../../../constants/theme';

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

function GameRow({ game, isLast, onPress }: { game: (typeof GAMES)[number]; isLast: boolean; onPress: () => void }) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.row, !isLast && styles.rowDivider]}
        accessibilityRole="button"
        accessibilityLabel={`${game.title}: ${game.desc}`}
      >
        <View style={[styles.iconWrap, { backgroundColor: game.color + '1F' }]}>
          <Ionicons name={game.icon} size={24} color={game.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>{game.title}</Text>
          <Text style={styles.rowDesc}>{game.desc}</Text>
        </View>
        <Ionicons name="chevron-back" size={18} color={colors.muted} />
      </Pressable>
    </Animated.View>
  );
}

export default function GamesHub() {
  const router = useRouter();
  return (
    <Screen>
      <GradientHeader title="ألعابنا 🎮" subtitle="اختاروا لعبة تلعبونها مع بعض الحين" />
      <View style={styles.group}>
        {GAMES.map((g, i) => (
          <GameRow
            key={g.key}
            game={g}
            isLast={i === GAMES.length - 1}
            onPress={() => router.push(`/(tabs)/games/${g.key}` as any)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
    padding: spacing(2),
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontWeight: '800', fontSize: 15, color: colors.text, textAlign: 'right' },
  rowDesc: { color: colors.muted, fontSize: 12.5, textAlign: 'right', marginTop: 2 },
});
