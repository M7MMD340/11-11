import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, Couple } from '../lib/types';

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  couple: Couple | null;
  partnerId: string | null;
  initializing: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  couple: null,
  partnerId: null,
  initializing: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setProfile(null);
        setCouple(null);
        setInitializing(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        setProfile({ uid: snap.id, ...(snap.data() as any) });
      } else {
        setProfile(null);
      }
      setInitializing(false);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!profile?.coupleId) {
      setCouple(null);
      return;
    }
    const unsub = onSnapshot(doc(db, 'couples', profile.coupleId), (snap) => {
      if (snap.exists()) {
        setCouple({ id: snap.id, ...(snap.data() as any) });
      } else {
        setCouple(null);
      }
    });
    return unsub;
  }, [profile?.coupleId]);

  const partnerId = useMemo(() => {
    if (!couple || !user) return null;
    return couple.members.find((m) => m !== user.uid) ?? null;
  }, [couple, user]);

  return (
    <AuthContext.Provider value={{ user, profile, couple, partnerId, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
