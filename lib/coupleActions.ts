import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
  arrayUnion,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function createCouple(uid: string) {
  const inviteCode = generateInviteCode();
  const coupleRef = await addDoc(collection(db, 'couples'), {
    inviteCode,
    members: [uid],
    createdAt: Date.now(),
  });
  await setDoc(
    doc(db, 'couples', coupleRef.id, 'world', 'state'),
    { coins: 20, plants: [], furniture: [], outfits: {} },
    { merge: true },
  );
  await updateDoc(doc(db, 'users', uid), { coupleId: coupleRef.id });
  return { coupleId: coupleRef.id, inviteCode };
}

export async function joinCouple(uid: string, inviteCode: string) {
  const q = query(
    collection(db, 'couples'),
    where('inviteCode', '==', inviteCode.trim().toUpperCase()),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    throw new Error('لم يتم العثور على رمز الدعوة هذا. تأكدوا من كتابته بشكل صحيح.');
  }
  const coupleDoc = snap.docs[0];
  const data = coupleDoc.data();
  if (data.members?.length >= 2 && !data.members.includes(uid)) {
    throw new Error('هذا الحساب مرتبط بزوجين بالفعل.');
  }
  await updateDoc(doc(db, 'couples', coupleDoc.id), { members: arrayUnion(uid) });
  await updateDoc(doc(db, 'users', uid), { coupleId: coupleDoc.id });
  return coupleDoc.id;
}
