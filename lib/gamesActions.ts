import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { TRUTH_CARDS, DARE_CARDS, QUIZ_QUESTIONS, PICTIONARY_WORDS } from '../constants/gameContent';
import { awardCoins } from './worldActions';

function gameDoc(coupleId: string, name: string) {
  return doc(db, 'couples', coupleId, 'games', name);
}

function pickUnused<T extends { id: string } | string>(all: T[], used: string[], idOf: (x: T) => string) {
  const remaining = all.filter((x) => !used.includes(idOf(x)));
  const pool = remaining.length ? remaining : all;
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- Truth or Dare ---
export async function drawTruthOrDareCard(coupleId: string, kind: 'truth' | 'dare', myUid: string, partnerId: string) {
  const cards = kind === 'truth' ? TRUTH_CARDS : DARE_CARDS;
  const ref = gameDoc(coupleId, 'truthOrDare');
  const snap = await getDoc(ref);
  const used: string[] = snap.exists() ? snap.data().usedCardIds ?? [] : [];
  const withIds = cards.map((text, i) => ({ id: `${kind}-${i}`, text }));
  const picked = pickUnused(withIds, used, (x) => x.id);
  await setDoc(
    ref,
    {
      turn: partnerId,
      currentCardId: picked.id,
      currentCardText: picked.text,
      currentCardKind: kind,
      usedCardIds: [...used, picked.id].slice(-Math.max(cards.length - 1, 4)),
      updatedAt: Date.now(),
    },
    { merge: true },
  );
  await awardCoins(coupleId, 1);
}

export async function passTurnTruthOrDare(coupleId: string, partnerId: string) {
  await updateDoc(gameDoc(coupleId, 'truthOrDare'), {
    turn: partnerId,
    currentCardId: null,
    currentCardText: null,
  });
}

// --- Quiz ---
export async function startQuizQuestion(coupleId: string) {
  const ref = gameDoc(coupleId, 'quiz');
  const snap = await getDoc(ref);
  const used: string[] = snap.exists() ? snap.data().askedQuestionIds ?? [] : [];
  const q = pickUnused(QUIZ_QUESTIONS, used, (x) => x.id);
  await setDoc(
    ref,
    {
      currentQuestionId: q.id,
      currentQuestionText: q.text,
      askedQuestionIds: [...used, q.id].slice(-Math.max(QUIZ_QUESTIONS.length - 1, 4)),
      answers: {},
      revealed: false,
      updatedAt: Date.now(),
    },
    { merge: true },
  );
}

export async function submitQuizAnswer(coupleId: string, uid: string, answer: string) {
  const ref = gameDoc(coupleId, 'quiz');
  await updateDoc(ref, { [`answers.${uid}`]: answer });
  const snap = await getDoc(ref);
  const answers = snap.exists() ? snap.data().answers ?? {} : {};
  if (Object.keys(answers).length >= 2) {
    await awardCoins(coupleId, 3);
  }
}

export async function revealQuiz(coupleId: string) {
  await updateDoc(gameDoc(coupleId, 'quiz'), { revealed: true });
}

// --- Pictionary ---
export async function startPictionaryRound(coupleId: string, drawerId: string, previousRound = 0) {
  const word = PICTIONARY_WORDS[Math.floor(Math.random() * PICTIONARY_WORDS.length)];
  await setDoc(gameDoc(coupleId, 'pictionary'), {
    drawerId,
    word,
    strokes: [],
    status: 'drawing',
    lastGuess: null,
    round: previousRound + 1,
    updatedAt: Date.now(),
  });
}

export async function pushPictionaryStroke(coupleId: string, strokes: any[]) {
  await updateDoc(gameDoc(coupleId, 'pictionary'), { strokes });
}

export async function clearPictionaryCanvas(coupleId: string) {
  await updateDoc(gameDoc(coupleId, 'pictionary'), { strokes: [] });
}

export async function submitPictionaryGuess(coupleId: string, uid: string, text: string, word: string) {
  const correct = text.trim() === word.trim();
  await updateDoc(gameDoc(coupleId, 'pictionary'), {
    lastGuess: { uid, text, correct },
    ...(correct ? { status: 'guessed' } : {}),
  });
  return correct;
}
