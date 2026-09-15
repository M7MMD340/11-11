import { useState } from 'react';
import { View, Image, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { chatStyles as s } from './styles';

export function CaptionComposer({
  uri,
  sending,
  onDiscard,
  onSend,
}: {
  uri: string;
  sending: boolean;
  onDiscard: () => void;
  onSend: (caption: string) => void;
}) {
  const [caption, setCaption] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Image source={{ uri }} style={{ flex: 1 }} resizeMode="cover" />
      <View style={s.captionBar}>
        <TextInput
          placeholder="اكتب تعليق..."
          placeholderTextColor="#ddd"
          value={caption}
          onChangeText={setCaption}
          style={s.captionInput}
          accessibilityLabel="تعليق على اللحظة"
        />
        <Pressable onPress={onDiscard} style={s.iconBtn} accessibilityRole="button" accessibilityLabel="حذف الصورة">
          <Ionicons name="trash" size={22} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => onSend(caption)}
          disabled={sending}
          style={[s.iconBtn, { backgroundColor: colors.primary }]}
          accessibilityRole="button"
          accessibilityLabel="إرسال اللحظة"
          accessibilityState={{ disabled: sending }}
        >
          <Ionicons name="send" size={22} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
