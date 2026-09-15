import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Idea } from '../../lib/types';
import { addIdea, toggleIdea, removeIdea } from '../../lib/ideasActions';
import { Screen, Title, Subtitle, Field, Button } from '../../components/ui';
import { colors, spacing } from '../../constants/theme';

export default function IdeasBoard() {
  const { user, couple } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!couple) return;
    const q = query(collection(db, 'couples', couple.id, 'ideas'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setIdeas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }) as Idea));
    });
    return unsub;
  }, [couple]);

  async function onAdd() {
    if (!couple || !user || !text.trim()) return;
    const value = text.trim();
    setText('');
    await addIdea(couple.id, user.uid, value);
  }

  const pending = ideas.filter((i) => !i.done);
  const done = ideas.filter((i) => i.done);

  return (
    <Screen>
      <Title>أفكارنا 💡</Title>
      <Subtitle>مواعيد، أمنيات، وأفكار نسويها مع بعض</Subtitle>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Field
          placeholder="فكرة جديدة..."
          value={text}
          onChangeText={setText}
          style={{ flex: 1 }}
          onSubmitEditing={onAdd}
        />
      </View>
      <Button title="إضافة" onPress={onAdd} />

      <FlatList
        style={{ marginTop: spacing(2) }}
        data={[...pending, ...done]}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>ما فيه أفكار بعد، ابدأوا بإضافة أول فكرة!</Text>}
        renderItem={({ item }) => (
          <View style={[styles.row, item.done && { opacity: 0.5 }]}>
            <Pressable onPress={() => removeIdea(couple!.id, item.id)}>
              <Ionicons name="trash-outline" size={20} color={colors.muted} />
            </Pressable>
            <Text style={[styles.rowText, item.done && styles.rowTextDone]}>{item.text}</Text>
            <Pressable onPress={() => toggleIdea(couple!.id, item.id, !item.done)}>
              <Ionicons
                name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={item.done ? colors.success : colors.primary}
              />
            </Pressable>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: 'center', color: colors.muted, marginTop: spacing(4) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing(1.5),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  rowText: { flex: 1, color: colors.text, textAlign: 'right' },
  rowTextDone: { textDecorationLine: 'line-through' },
});
