import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Moment } from '../../lib/types';
import { sendMoment, markMomentViewed, deleteMoment } from '../../lib/momentsActions';
import { colors } from '../../constants/theme';
import { Screen, GradientHeader, AnimatedCard } from '../../components/ui';
import { CameraCapture } from '../../components/moments/CameraCapture';
import { CaptionComposer } from '../../components/moments/CaptionComposer';
import { MomentViewer } from '../../components/moments/MomentViewer';
import { FabButton } from '../../components/moments/FabButton';
import { momentsStyles as styles } from '../../components/moments/styles';

function timeLeftLabel(expiresAt: number) {
  const ms = expiresAt - Date.now();
  if (ms <= 0) return 'منتهية';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours >= 1) return `${hours} س متبقية`;
  const mins = Math.max(1, Math.floor(ms / (1000 * 60)));
  return `${mins} د متبقية`;
}

export default function MomentsFeed() {
  const { user, couple, partnerId } = useAuth();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [captured, setCaptured] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Moment | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!couple) return;
    const q = query(collection(db, 'couples', couple.id, 'moments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const now = Date.now();
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }) as Moment)
        .filter((m) => m.expiresAt > now);
      setMoments(list);
    });
    return unsub;
  }, [couple]);

  async function openCamera() {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }
    setShowCamera(true);
  }

  async function onSend(caption: string) {
    if (!couple || !user || !captured) return;
    setSending(true);
    try {
      await sendMoment(couple.id, user.uid, captured, caption);
      setCaptured(null);
    } finally {
      setSending(false);
    }
  }

  function openViewer(m: Moment) {
    setViewing(m);
    if (user && m.senderId !== user.uid && !m.viewedBy.includes(user.uid) && couple) {
      markMomentViewed(couple.id, m.id, user.uid);
      setTimeout(() => {
        setViewing(null);
        deleteMoment(couple.id, m.id);
      }, 5000);
    }
  }

  if (showCamera) {
    return (
      <CameraCapture
        onCancel={() => setShowCamera(false)}
        onCapture={(uri) => {
          setCaptured(uri);
          setShowCamera(false);
        }}
      />
    );
  }

  if (captured) {
    return (
      <CaptionComposer uri={captured} sending={sending} onDiscard={() => setCaptured(null)} onSend={onSend} />
    );
  }

  return (
    <Screen>
      <GradientHeader title="لحظاتنا 📸" subtitle="شاركوا لحظاتكم قبل ما تختفي" />
      <FlatList
        data={moments}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={styles.empty}>ما فيه لحظات بعد. صوّر أول لحظة! 💫</Text>}
        renderItem={({ item, index }) => {
          const isMine = item.senderId === user?.uid;
          const viewedByPartner = partnerId ? item.viewedBy.includes(partnerId) : false;
          return (
            <AnimatedCard
              index={index}
              onPress={() => openViewer(item)}
              style={styles.momentRow}
            >
              <View style={styles.momentThumb}>
                <Ionicons name="image" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.momentTitle}>{isMine ? 'أنت أرسلت لحظة' : 'وصلتك لحظة جديدة'}</Text>
                <Text style={styles.momentSub}>
                  {timeLeftLabel(item.expiresAt)} {isMine ? (viewedByPartner ? '· تمت المشاهدة' : '· بانتظار المشاهدة') : ''}
                </Text>
              </View>
            </AnimatedCard>
          );
        }}
      />
      <FabButton onPress={openCamera} />
      <MomentViewer moment={viewing} onClose={() => setViewing(null)} />
    </Screen>
  );
}
