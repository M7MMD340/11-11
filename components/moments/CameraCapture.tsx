import { useRef, useState } from 'react';
import { View, Pressable } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { momentsStyles as s } from './styles';

export function CameraCapture({
  onCapture,
  onCancel,
}: {
  onCapture: (uri: string) => void;
  onCancel: () => void;
}) {
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const cameraRef = useRef<CameraView>(null);

  async function takePhoto() {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.6 });
    if (photo?.uri) onCapture(photo.uri);
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      <View style={s.cameraBar}>
        <Pressable onPress={onCancel} style={s.cameraCancel} accessibilityRole="button" accessibilityLabel="إلغاء التصوير">
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>
        <Pressable onPress={takePhoto} style={s.shutter} accessibilityRole="button" accessibilityLabel="التقاط صورة" />
        <Pressable
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
          style={s.cameraFlip}
          accessibilityRole="button"
          accessibilityLabel="تبديل الكاميرا الأمامية والخلفية"
        >
          <Ionicons name="camera-reverse" size={28} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
