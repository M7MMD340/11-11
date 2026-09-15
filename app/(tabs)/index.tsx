import { useEffect, useLayoutEffect, useState } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage, ChatMeta } from '../../lib/types';
import { sendTextMessage, sendPhotoMessage, markMessageViewed, deletePhotoMessage } from '../../lib/chatActions';
import { Screen } from '../../components/ui';
import { CameraCapture } from '../../components/chat/CameraCapture';
import { CaptionComposer } from '../../components/chat/CaptionComposer';
import { PhotoViewer } from '../../components/chat/PhotoViewer';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { InputBar } from '../../components/chat/InputBar';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { PhotoBubble } from '../../components/chat/PhotoBubble';
import { Text } from 'react-native';
import { chatStyles as styles } from '../../components/chat/styles';
import { spacing, TAB_BAR_CLEARANCE } from '../../constants/theme';

export default function ChatScreen() {
  const { user, couple, partnerId, partnerProfile } = useAuth();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [meta, setMeta] = useState<ChatMeta>({ streak: 0, lastActiveDate: null });
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [captured, setCaptured] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [viewing, setViewing] = useState<ChatMessage | null>(null);

  const fullScreenTakeover = showCamera || !!captured;

  // Hide the floating tab bar while the camera/caption screens cover the
  // whole viewport — otherwise it floats over the live camera preview.
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: fullScreenTakeover ? { display: 'none' } : undefined,
    });
  }, [fullScreenTakeover, navigation]);

  useEffect(() => {
    if (!couple) return;
    const q = query(collection(db, 'couples', couple.id, 'messages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const now = Date.now();
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }) as ChatMessage)
        .filter((m) => m.type === 'text' || !m.expiresAt || m.expiresAt > now);
      setMessages(list);
    });
    return unsub;
  }, [couple]);

  useEffect(() => {
    if (!couple) return;
    const unsub = onSnapshot(doc(db, 'couples', couple.id, 'chat', 'meta'), (snap) => {
      setMeta(snap.exists() ? (snap.data() as ChatMeta) : { streak: 0, lastActiveDate: null });
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

  async function onSendText(text: string) {
    if (!couple || !user) return;
    await sendTextMessage(couple.id, user.uid, text);
  }

  async function onSendPhoto(caption: string) {
    if (!couple || !user || !captured) return;
    setSending(true);
    try {
      await sendPhotoMessage(couple.id, user.uid, captured, caption);
      setCaptured(null);
    } finally {
      setSending(false);
    }
  }

  function openPhoto(m: ChatMessage) {
    if (!user || !couple) return;
    const alreadyOpened = m.viewedBy.includes(user.uid);
    setViewing(m);
    if (!alreadyOpened && m.senderId !== user.uid) {
      markMessageViewed(couple.id, m.id, user.uid);
      setTimeout(() => {
        setViewing(null);
        deletePhotoMessage(couple.id, m.id);
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
    return <CaptionComposer uri={captured} sending={sending} onDiscard={() => setCaptured(null)} onSend={onSendPhoto} />;
  }

  return (
    <Screen style={{ padding: 0 }}>
      <View style={{ paddingHorizontal: spacing(2), paddingTop: spacing(2) }}>
        <ChatHeader partnerName={partnerProfile?.displayName ?? 'شريكك'} streak={meta.streak} />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          inverted
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={<Text style={styles.empty}>ابدأوا أول رسالة أو لقطة مع بعض! 💬</Text>}
          renderItem={({ item }) => {
            const mine = item.senderId === user?.uid;
            if (item.type === 'photo') {
              return (
                <PhotoBubble
                  message={item}
                  mine={mine}
                  opened={!!user && item.viewedBy.includes(user.uid)}
                  onOpen={() => openPhoto(item)}
                />
              );
            }
            return <MessageBubble message={item} mine={mine} />;
          }}
        />
        <View style={{ paddingBottom: TAB_BAR_CLEARANCE - spacing(2) }}>
          <InputBar onSendText={onSendText} onOpenCamera={openCamera} />
        </View>
      </KeyboardAvoidingView>
      <PhotoViewer message={viewing} onClose={() => setViewing(null)} />
    </Screen>
  );
}
