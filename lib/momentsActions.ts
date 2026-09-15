import { addDoc, collection, deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function sendMoment(coupleId: string, uid: string, localUri: string, caption: string) {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const path = `moments/${coupleId}/${Date.now()}_${uid}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'couples', coupleId, 'moments'), {
    senderId: uid,
    imageUrl,
    storagePath: path,
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

export async function deleteMoment(coupleId: string, momentId: string, storagePath?: string) {
  if (storagePath) {
    try {
      await deleteObject(ref(storage, storagePath));
    } catch {
      // already gone, ignore
    }
  }
  await deleteDoc(doc(db, 'couples', coupleId, 'moments', momentId));
}
