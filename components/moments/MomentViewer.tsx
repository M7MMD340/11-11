import { Modal, View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Moment } from '../../lib/types';
import { momentsStyles as s } from './styles';

export function MomentViewer({ moment, onClose }: { moment: Moment | null; onClose: () => void }) {
  return (
    <Modal visible={!!moment} animationType="fade" transparent={false}>
      {moment && (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <Image source={{ uri: moment.imageData }} style={{ flex: 1 }} resizeMode="contain" />
          {!!moment.caption && (
            <View style={s.viewerCaption}>
              <Text style={{ color: '#fff', fontSize: 16 }}>{moment.caption}</Text>
            </View>
          )}
          <Pressable style={s.viewerClose} onPress={onClose} accessibilityRole="button" accessibilityLabel="إغلاق" hitSlop={12}>
            <Ionicons name="close" size={30} color="#fff" />
          </Pressable>
        </View>
      )}
    </Modal>
  );
}
