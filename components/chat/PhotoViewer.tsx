import { Modal, View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '../../lib/types';

export function PhotoViewer({ message, onClose }: { message: ChatMessage | null; onClose: () => void }) {
  return (
    <Modal visible={!!message} animationType="fade" transparent={false}>
      {message && (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <Image source={{ uri: message.imageData }} style={{ flex: 1 }} resizeMode="contain" />
          {!!message.text && (
            <View style={{ position: 'absolute', bottom: 60, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 12 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>{message.text}</Text>
            </View>
          )}
          <Pressable
            style={{ position: 'absolute', top: 50, right: 20 }}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="إغلاق"
            hitSlop={12}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </Pressable>
        </View>
      )}
    </Modal>
  );
}
