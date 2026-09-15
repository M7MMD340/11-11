import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';
import { drawTruthOrDareCard, passTurnTruthOrDare } from '../../../lib/gamesActions';
import { Screen, Card, Button, Subtitle } from '../../../components/ui';
import { colors, spacing } from '../../../constants/theme';

type State = {
  turn: string;
  currentCardId: string | null;
  currentCardText: string | null;
  currentCardKind: 'truth' | 'dare' | null;
};

export default function TruthOrDare() {
  const { user, couple, partnerId } = useAuth();
  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!couple) return;
    const unsub = onSnapshot(doc(db, 'couples', couple.id, 'games', 'truthOrDare'), (snap) => {
      setState(snap.exists() ? (snap.data() as State) : { turn: user?.uid ?? '', currentCardId: null, currentCardText: null, currentCardKind: null });
    });
    return unsub;
  }, [couple]);

  const myTurn = state ? state.turn === user?.uid : true;

  async function draw(kind: 'truth' | 'dare') {
    if (!couple || !user || !partnerId) return;
    setLoading(true);
    try {
      await drawTruthOrDareCard(couple.id, kind, user.uid, partnerId);
    } finally {
      setLoading(false);
    }
  }

  async function passTurn() {
    if (!couple || !partnerId) return;
    await passTurnTruthOrDare(couple.id, partnerId);
  }

  return (
    <Screen>
      <Subtitle>{myTurn ? 'دورك! اختر صراحة أو تحدي' : 'دور شريكك الحين، انتظر السؤال'}</Subtitle>

      {state?.currentCardText ? (
        <Card style={{ marginBottom: spacing(2) }}>
          <Text style={styles.kind}>{state.currentCardKind === 'truth' ? 'صراحة 🗣️' : 'تحدي 🔥'}</Text>
          <Text style={styles.cardText}>{state.currentCardText}</Text>
        </Card>
      ) : (
        <Card style={{ marginBottom: spacing(2), alignItems: 'center' }}>
          <Text style={{ color: colors.muted }}>ما فيه سؤال حالياً</Text>
        </Card>
      )}

      {myTurn && (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="صراحة" onPress={() => draw('truth')} loading={loading} />
          <Button title="تحدي" onPress={() => draw('dare')} variant="secondary" loading={loading} />
        </View>
      )}

      {!myTurn && state?.currentCardText && (
        <Button title="تم! دور شريكي" onPress={passTurn} variant="ghost" />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kind: { fontWeight: '700', color: colors.primary, marginBottom: spacing(1), textAlign: 'right' },
  cardText: { fontSize: 20, color: colors.text, textAlign: 'right', lineHeight: 30 },
});
