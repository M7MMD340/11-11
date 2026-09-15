import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './firebase';
import { compressToBase64 } from './imageUtils';
import { ChatMeta } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function bumpStreak(coupleId: string) {
  const ref = doc(db, 'couples', coupleId, 'chat', 'meta');
  const snap = await getDoc(ref);
  const data: ChatMeta = snap.exists() ? (snap.data() as ChatMeta) : { streak: 0, lastActiveDate: null };
  const today = dateKey(new Date());
  if (data.lastActiveDate === today) return;

  const yesterday = dateKey(new Date(Date.now() - DAY_MS));
  const nextStreak = data.lastActiveDate === yesterday ? (data.streak ?? 0) + 1 : 1;
  await setDoc(ref, { streak: nextStreak, lastActiveDate: today }, { merge: true });
}

export async function sendTextMessage(coupleId: string, uid: string, text: string) {
  await addDoc(collection(db, 'couples', coupleId, 'messages'), {
    senderId: uid,
    type: 'text',
    text,
    createdAt: Date.now(),
    viewedBy: [uid],
  });
  await bumpStreak(coupleId);
}

export async function sendPhotoMessage(coupleId: string, uid: string, localUri: string, caption: string) {
  const imageData = await compressToBase64(localUri);
  await addDoc(collection(db, 'couples', coupleId, 'messages'), {
    senderId: uid,
    type: 'photo',
    text: caption || '',
    imageData,
    createdAt: Date.now(),
    expiresAt: Date.now() + DAY_MS,
    viewedBy: [uid],
  });
  await bumpStreak(coupleId);
}

export async function markMessageViewed(coupleId: string, messageId: string, uid: string) {
  await updateDoc(doc(db, 'couples', coupleId, 'messages', messageId), {
    viewedBy: arrayUnion(uid),
  });
}

export async function deletePhotoMessage(coupleId: string, messageId: string) {
  await deleteDoc(doc(db, 'couples', coupleId, 'messages', messageId));
}
