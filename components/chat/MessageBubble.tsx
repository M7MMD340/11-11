import { View, Text } from 'react-native';
import { ChatMessage } from '../../lib/types';
import { chatStyles as s } from './styles';

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message, mine }: { message: ChatMessage; mine: boolean }) {
  return (
    <View style={[s.bubbleRow, mine ? s.bubbleRowMine : s.bubbleRowTheirs]}>
      <View style={[s.textBubble, mine ? s.textBubbleMine : s.textBubbleTheirs]}>
        <Text style={mine ? s.bubbleTextMine : s.bubbleTextTheirs}>{message.text}</Text>
        <Text style={[s.bubbleTime, mine ? s.bubbleTimeMine : s.bubbleTimeTheirs]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}
