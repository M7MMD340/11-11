import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function addIdea(coupleId: string, uid: string, text: string) {
  await addDoc(collection(db, 'couples', coupleId, 'ideas'), {
    text,
    createdBy: uid,
    createdAt: Date.now(),
    done: false,
  });
}

export async function toggleIdea(coupleId: string, ideaId: string, done: boolean) {
  await updateDoc(doc(db, 'couples', coupleId, 'ideas', ideaId), { done });
}

export async function removeIdea(coupleId: string, ideaId: string) {
  await deleteDoc(doc(db, 'couples', coupleId, 'ideas', ideaId));
}
