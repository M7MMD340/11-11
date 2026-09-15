import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';
import { startQuizQuestion, submitQuizAnswer } from '../../../lib/gamesActions';
import { Screen, Card, Button, Field, Subtitle } from '../../../components/ui';
import { colors, spacing } from '../../../constants/theme';

type State = {
  currentQuestionText: string | null;
  answers: Record<string, string>;
};

export default function Quiz() {
  const { user, couple, partnerId } = useAuth();
  const [state, setState] = useState<State | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!couple) return;
    const unsub = onSnapshot(doc(db, 'couples', couple.id, 'games', 'quiz'), (snap) => {
      setState(snap.exists() ? (snap.data() as any) : { currentQuestionText: null, answers: {} });
      setAnswer('');
    });
    return unsub;
  }, [couple]);

  const myAnswer = user ? state?.answers?.[user.uid] : undefined;
  const partnerAnswer = partnerId ? state?.answers?.[partnerId] : undefined;
  const bothAnswered = !!myAnswer && !!partnerAnswer;

  async function onStart() {
    if (!couple) return;
    setLoading(true);
    try {
      await startQuizQuestion(couple.id);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit() {
    if (!couple || !user || !answer.trim()) return;
    await submitQuizAnswer(couple.id, user.uid, answer.trim());
  }

  return (
    <Screen>
      <Subtitle>جاوبوا كل وحد لحاله وشوفوا كم تعرفون بعض</Subtitle>

      {!state?.currentQuestionText && (
        <Button title="سؤال جديد" onPress={onStart} loading={loading} />
      )}

      {state?.currentQuestionText && (
        <Card style={{ marginBottom: spacing(2) }}>
          <Text style={styles.question}>{state.currentQuestionText}</Text>
        </Card>
      )}

      {state?.currentQuestionText && !myAnswer && (
        <>
          <Field placeholder="إجابتك..." value={answer} onChangeText={setAnswer} onSubmitEditing={onSubmit} />
          <Button title="إرسال الإجابة" onPress={onSubmit} disabled={!answer.trim()} />
        </>
      )}

      {state?.currentQuestionText && myAnswer && !bothAnswered && (
        <Text style={styles.waiting}>إجابتك: {myAnswer}\nبانتظار إجابة شريكك...</Text>
      )}

      {bothAnswered && (
        <View style={{ gap: spacing(1.5) }}>
          <Card>
            <Text style={styles.who}>إجابتك</Text>
            <Text style={styles.ans}>{myAnswer}</Text>
          </Card>
          <Card>
            <Text style={styles.who}>إجابة شريكك</Text>
            <Text style={styles.ans}>{partnerAnswer}</Text>
          </Card>
          <Button title="سؤال ثاني" onPress={onStart} loading={loading} variant="secondary" />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  question: { fontSize: 19, fontWeight: '700', color: colors.text, textAlign: 'right', lineHeight: 28 },
  waiting: { color: colors.muted, marginTop: spacing(1), textAlign: 'right' },
  who: { color: colors.muted, fontSize: 12, textAlign: 'right' },
  ans: { color: colors.text, fontSize: 16, fontWeight: '600', textAlign: 'right', marginTop: 4 },
});
