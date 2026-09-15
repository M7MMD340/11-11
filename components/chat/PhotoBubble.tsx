import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatMessage } from '../../lib/types';
import { gradients } from '../../constants/theme';
import { chatStyles as s } from './styles';

export function PhotoBubble({
  message,
  mine,
  opened,
  onOpen,
}: {
  message: ChatMessage;
  mine: boolean;
  opened: boolean;
  onOpen: () => void;
}) {
  const showThumbnail = mine || opened;

  return (
    <View style={[s.bubbleRow, mine ? s.bubbleRowMine : s.bubbleRowTheirs]}>
      {showThumbnail ? (
        <View style={s.photoBubble}>
          <Image source={{ uri: message.imageData }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          {!mine && (
            <View style={s.photoOpenedBadge}>
              <Ionicons name="checkmark-done" size={12} color="#fff" />
              <Text style={s.photoOpenedText}>شوهدت</Text>
            </View>
          )}
        </View>
      ) : (
        <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel="اضغط لمشاهدة اللقطة">
          <LinearGradient colors={gradients.hero} style={s.photoLocked}>
            <Ionicons name="eye" size={26} color="#fff" />
            <Text style={s.photoLockedText}>اضغط للمشاهدة</Text>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}
