import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, GestureResponderEvent } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';
import {
  startPictionaryRound,
  pushPictionaryStroke,
  clearPictionaryCanvas,
  submitPictionaryGuess,
} from '../../../lib/gamesActions';
import { awardCoins } from '../../../lib/worldActions';
import { Screen, Card, Button, Field, Subtitle, HeartBurst } from '../../../components/ui';
import { colors, spacing } from '../../../constants/theme';

type Stroke = { color: string; points: number[] };
type State = {
  drawerId: string;
  word: string | null;
  strokes: Stroke[];
  status: 'waiting' | 'drawing' | 'guessed';
  lastGuess: { uid: string; text: string; correct: boolean } | null;
  round: number;
};

const CANVAS_HEIGHT = 320;

export default function Pictionary() {
  const { user, couple, partnerId } = useAuth();
  const [state, setState] = useState<State | null>(null);
  const [guess, setGuess] = useState('');
  const [localStroke, setLocalStroke] = useState<number[]>([]);
  const strokesRef = useRef<Stroke[]>([]);
  const lastSync = useRef(0);

  useEffect(() => {
    if (!couple) return;
    const unsub = onSnapshot(doc(db, 'couples', couple.id, 'games', 'pictionary'), (snap) => {
      const data = snap.exists() ? (snap.data() as State) : null;
      setState(data);
      strokesRef.current = data?.strokes ?? [];
    });
    return unsub;
  }, [couple]);

  const isDrawer = state ? state.drawerId === user?.uid : false;

  async function onNewRound() {
    if (!couple || !user) return;
    await startPictionaryRound(couple.id, user.uid, state?.round ?? 0);
  }

  async function onPassBrush() {
    if (!couple || !partnerId) return;
    await startPictionaryRound(couple.id, partnerId, state?.round ?? 0);
  }

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isDrawer,
      onMoveShouldSetPanResponder: () => isDrawer,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        const { locationX, locationY } = e.nativeEvent;
        setLocalStroke([locationX, locationY]);
      },
      onPanResponderMove: (e: GestureResponderEvent) => {
        const { locationX, locationY } = e.nativeEvent;
        setLocalStroke((prev) => {
          const next = [...prev, locationX, locationY];
          const now = Date.now();
          if (couple && now - lastSync.current > 120) {
            lastSync.current = now;
            const preview = [...strokesRef.current, { color: colors.text, points: next }];
            pushPictionaryStroke(couple.id, preview);
          }
          return next;
        });
      },
      onPanResponderRelease: () => {
        if (!couple) return;
        setLocalStroke((finalPoints) => {
          if (finalPoints.length >= 4) {
            const finalStrokes = [...strokesRef.current, { color: colors.text, points: finalPoints }];
            strokesRef.current = finalStrokes;
            pushPictionaryStroke(couple.id, finalStrokes);
          }
          return [];
        });
      },
    }),
  ).current;

  async function onGuess() {
    if (!couple || !user || !guess.trim() || !state?.word) return;
    const correct = await submitPictionaryGuess(couple.id, user.uid, guess.trim(), state.word);
    if (correct) {
      await awardCoins(couple.id, 5);
    }
    setGuess('');
  }

  const displayStrokes: Stroke[] = isDrawer && localStroke.length
    ? [...(state?.strokes ?? []), { color: colors.text, points: localStroke }]
    : (state?.strokes ?? []);

  return (
    <Screen>
      <Subtitle>
        {!state?.word
          ? 'ابدأوا جولة رسم جديدة'
          : isDrawer
          ? `ارسم كلمة: ${state.word}`
          : 'خمّن وش يرسم شريكك!'}
      </Subtitle>

      {!state?.word && <Button title="ابدأ جولة (أنا أرسم)" onPress={onNewRound} />}

      {!!state?.word && (
        <>
          <View style={styles.canvasWrap} {...(isDrawer ? pan.panHandlers : {})}>
            <Svg width="100%" height={CANVAS_HEIGHT}>
              {displayStrokes.map((s, i) => (
                <Polyline
                  key={i}
                  points={pointsToString(s.points)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </Svg>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing(1) }}>
            {isDrawer && (
              <Button title="مسح" onPress={() => couple && clearPictionaryCanvas(couple.id)} variant="ghost" />
            )}
          </View>

          {state.status === 'guessed' && (
            <Card style={{ marginTop: spacing(2), alignItems: 'center' }}>
              <HeartBurst key={state.round} />
              <Text style={styles.correct}>صح! الكلمة كانت: {state.word} 🎉</Text>
              <Button title={isDrawer ? 'تبادل الأدوار' : 'أنا أرسم الحين'} onPress={onPassBrush} />
            </Card>
          )}

          {!isDrawer && state.status !== 'guessed' && (
            <View style={{ marginTop: spacing(2) }}>
              <Field placeholder="اكتب تخمينك..." value={guess} onChangeText={setGuess} onSubmitEditing={onGuess} />
              <Button title="خمّن" onPress={onGuess} disabled={!guess.trim()} />
              {state.lastGuess && !state.lastGuess.correct && (
                <Text style={styles.wrong}>تخمين "{state.lastGuess.text}" غلط، حاول مرة ثانية</Text>
              )}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

function pointsToString(points: number[]) {
  const pairs = [];
  for (let i = 0; i < points.length; i += 2) {
    pairs.push(`${points[i]},${points[i + 1]}`);
  }
  return pairs.join(' ');
}

const styles = StyleSheet.create({
  canvasWrap: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  correct: { color: colors.success, fontWeight: '700', marginBottom: spacing(1) },
  wrong: { color: colors.danger, marginTop: spacing(1), textAlign: 'right' },
});
