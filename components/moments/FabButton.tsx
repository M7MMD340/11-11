import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { usePressScale } from '../ui';
import { momentsStyles as s } from './styles';

export function FabButton({ onPress }: { onPress: () => void }) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={[s.fabWrap, animatedStyle]}>
      <Pressable
        style={s.fab}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel="التقاط لحظة جديدة"
      >
        <Ionicons name="camera" size={28} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}
