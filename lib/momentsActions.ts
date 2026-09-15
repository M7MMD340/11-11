import { addDoc, collection, deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import * as ImageManipulator from 'expo-image-manipulator';
import { db } from './firebase';

const DAY_MS = 24 * 60 * 60 * 1000;
// Firestore documents are capped at 1MiB; base64 inflates size by ~33%,
// so we keep the compressed source well under that ceiling.
const MAX_WIDTH = 780;
const JPEG_QUALITY = 0.5;

async function compressToBase64(localUri: string) {
  const result = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: MAX_WIDTH } }],
    { compress: JPEG_QUALITY, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );
  if (!result.base64) throw new Error('تعذّر تجهيز الصورة');
  return `data:image/jpeg;base64,${result.base64}`;
}

export async function sendMoment(coupleId: string, uid: string, localUri: string, caption: string) {
  const imageData = await compressToBase64(localUri);

  await addDoc(collection(db, 'couples', coupleId, 'moments'), {
    senderId: uid,
    imageData,
    caption,
    createdAt: Date.now(),
    expiresAt: Date.now() + DAY_MS,
    viewedBy: [],
  });
}

export async function markMomentViewed(coupleId: string, momentId: string, uid: string) {
  await updateDoc(doc(db, 'couples', coupleId, 'moments', momentId), {
    viewedBy: arrayUnion(uid),
  });
}

export async function deleteMoment(coupleId: string, momentId: string) {
  await deleteDoc(doc(db, 'couples', coupleId, 'moments', momentId));
}
