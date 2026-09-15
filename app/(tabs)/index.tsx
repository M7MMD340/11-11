import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Moment } from '../../lib/types';
import { sendMoment, markMomentViewed, deleteMoment } from '../../lib/momentsActions';
import { colors, spacing } from '../../constants/theme';
import { Screen, Title } from '../../components/ui';

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
  const [caption, setCaption] = useState('');
  const [viewing, setViewing] = useState<Moment | null>(null);
  const [sending, setSending] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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

  async function takePhoto() {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.6 });
    if (photo?.uri) {
      setCaptured(photo.uri);
      setShowCamera(false);
    }
  }

  async function onSend() {
    if (!couple || !user || !captured) return;
    setSending(true);
    try {
      await sendMoment(couple.id, user.uid, captured, caption);
      setCaptured(null);
      setCaption('');
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
        deleteMoment(couple.id, m.id, m.storagePath);
      }, 5000);
    }
  }

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        <View style={styles.cameraBar}>
          <Pressable onPress={() => setShowCamera(false)} style={styles.cameraCancel}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Pressable onPress={takePhoto} style={styles.shutter} />
        </View>
      </View>
    );
  }

  if (captured) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Image source={{ uri: captured }} style={{ flex: 1 }} resizeMode="cover" />
        <View style={styles.captionBar}>
          <TextInput
            placeholder="اكتب تعليق..."
            placeholderTextColor="#ddd"
            value={caption}
            onChangeText={setCaption}
            style={styles.captionInput}
          />
          <Pressable onPress={() => setCaptured(null)} style={styles.iconBtn}>
            <Ionicons name="trash" size={22} color="#fff" />
          </Pressable>
          <Pressable onPress={onSend} disabled={sending} style={[styles.iconBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="send" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Screen>
      <Title>لحظاتنا 📸</Title>
      <FlatList
        data={moments}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingBottom: spacing(10) }}
        ListEmptyComponent={
          <Text style={styles.empty}>ما فيه لحظات بعد. صوّر أول لحظة! 💫</Text>
        }
        renderItem={({ item }) => {
          const isMine = item.senderId === user?.uid;
          const viewedByPartner = partnerId ? item.viewedBy.includes(partnerId) : false;
          return (
            <Pressable onPress={() => openViewer(item)} style={styles.momentRow}>
              <View style={styles.momentThumb}>
                <Ionicons name="image" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.momentTitle}>{isMine ? 'أنت أرسلت لحظة' : 'وصلتك لحظة جديدة'}</Text>
                <Text style={styles.momentSub}>
                  {timeLeftLabel(item.expiresAt)} {isMine ? (viewedByPartner ? '· تمت المشاهدة' : '· بانتظار المشاهدة') : ''}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
      <Pressable style={styles.fab} onPress={openCamera}>
        <Ionicons name="camera" size={28} color="#fff" />
      </Pressable>

      <Modal visible={!!viewing} animationType="fade" transparent={false}>
        {viewing && (
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Image source={{ uri: viewing.imageUrl }} style={{ flex: 1 }} resizeMode="contain" />
            {!!viewing.caption && (
              <View style={styles.viewerCaption}>
                <Text style={{ color: '#fff', fontSize: 16 }}>{viewing.caption}</Text>
              </View>
            )}
            <Pressable style={styles.viewerClose} onPress={() => setViewing(null)}>
              <Ionicons name="close" size={30} color="#fff" />
            </Pressable>
          </View>
        )}
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: 'center', color: colors.muted, marginTop: spacing(6) },
  momentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing(1.5),
    marginBottom: spacing(1.5),
    borderWidth: 1,
    borderColor: colors.border,
  },
  momentThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FDEDEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing(1.5),
  },
  momentTitle: { fontWeight: '700', color: colors.text, textAlign: 'right' },
  momentSub: { color: colors.muted, fontSize: 12, textAlign: 'right', marginTop: 2 },
  fab: {
    position: 'absolute',
    bottom: spacing(3),
    right: spacing(3),
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraBar: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  cameraCancel: { padding: 10 },
  shutter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#ccc',
    alignSelf: 'center',
    position: 'absolute',
    left: '50%',
    marginLeft: -37,
  },
  captionBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  captionInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerCaption: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 12,
    borderRadius: 12,
  },
  viewerClose: { position: 'absolute', top: 50, right: 20 },
});
