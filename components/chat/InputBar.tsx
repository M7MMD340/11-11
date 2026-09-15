import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { chatStyles as s } from './styles';

export function InputBar({
  onSendText,
  onOpenCamera,
}: {
  onSendText: (text: string) => void;
  onOpenCamera: () => void;
}) {
  const [text, setText] = useState('');

  function submit() {
    const value = text.trim();
    if (!value) return;
    onSendText(value);
    setText('');
  }

  return (
    <View style={s.inputBar}>
      <Pressable
        onPress={onOpenCamera}
        style={[s.roundBtn, s.roundBtnGhost]}
        accessibilityRole="button"
        accessibilityLabel="إرسال لقطة"
      >
        <Ionicons name="camera" size={22} color={colors.primary} />
      </Pressable>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="اكتب رسالة..."
        placeholderTextColor={colors.muted}
        style={s.textInput}
        multiline
        accessibilityLabel="رسالة نصية"
      />
      <Pressable
        onPress={submit}
        disabled={!text.trim()}
        style={[s.roundBtn, s.roundBtnPrimary, !text.trim() && { opacity: 0.4 }]}
        accessibilityRole="button"
        accessibilityLabel="إرسال"
        accessibilityState={{ disabled: !text.trim() }}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}
