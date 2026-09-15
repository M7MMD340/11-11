import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Plant, FurnitureItem } from './types';

function worldDoc(coupleId: string) {
  return doc(db, 'couples', coupleId, 'world', 'state');
}

export async function awardCoins(coupleId: string, amount: number) {
  await setDoc(worldDoc(coupleId), { coins: increment(amount) }, { merge: true });
}

export async function plantSeed(coupleId: string, kind: Plant['kind'], existing: Plant[]) {
  const newPlant: Plant = {
    id: `${Date.now()}`,
    kind,
    plantedAt: Date.now(),
    lastWateredAt: Date.now(),
  };
  await updateDoc(worldDoc(coupleId), {
    plants: [...existing, newPlant],
    coins: increment(-3),
  });
}

export async function waterPlant(coupleId: string, plants: Plant[], plantId: string) {
  const updated = plants.map((p) => (p.id === plantId ? { ...p, lastWateredAt: Date.now() } : p));
  await updateDoc(worldDoc(coupleId), { plants: updated });
}

export async function removePlant(coupleId: string, plants: Plant[], plantId: string) {
  await updateDoc(worldDoc(coupleId), { plants: plants.filter((p) => p.id !== plantId) });
}

export async function buyFurniture(coupleId: string, existing: FurnitureItem[], kind: string, cost: number, x: number, y: number) {
  const item: FurnitureItem = { id: `${Date.now()}`, kind, x, y };
  await updateDoc(worldDoc(coupleId), {
    furniture: [...existing, item],
    coins: increment(-cost),
  });
}

export async function moveFurniture(coupleId: string, furniture: FurnitureItem[], id: string, x: number, y: number) {
  const updated = furniture.map((f) => (f.id === id ? { ...f, x, y } : f));
  await updateDoc(worldDoc(coupleId), { furniture: updated });
}

export async function removeFurniture(coupleId: string, furniture: FurnitureItem[], id: string) {
  await updateDoc(worldDoc(coupleId), { furniture: furniture.filter((f) => f.id !== id) });
}

export async function setOutfit(coupleId: string, uid: string, color: string, hat: string, outfit: string) {
  await setDoc(worldDoc(coupleId), { outfits: { [uid]: { color, hat, outfit } } }, { merge: true });
}

export async function expandHouse(coupleId: string, currentLevel: number, cost: number) {
  await updateDoc(worldDoc(coupleId), { roomLevel: currentLevel + 1, coins: increment(-cost) });
}

export async function ensureWorldExists(coupleId: string) {
  const ref = worldDoc(coupleId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { coins: 20, roomLevel: 1, plants: [], furniture: [], outfits: {} });
  }
}
