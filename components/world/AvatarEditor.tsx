import { View, Text, Pressable } from 'react-native';
import { OUTFIT_OPTIONS, HAT_OPTIONS, COLOR_OPTIONS } from '../../constants/worldContent';
import { setOutfit } from '../../lib/worldActions';
import { WorldState } from '../../lib/types';
import { worldStyles as s } from './styles';

export function AvatarEditor({
  coupleId,
  uid,
  partnerId,
  world,
  myName,
}: {
  coupleId: string;
  uid: string;
  partnerId: string | null;
  world: WorldState;
  myName: string;
}) {
  const mine = world.outfits?.[uid] ?? { color: COLOR_OPTIONS[0], hat: 'بدون', outfit: OUTFIT_OPTIONS[0] };
  const partnerOutfit = partnerId ? world.outfits?.[partnerId] : null;

  return (
    <View>
      <View style={s.avatarRow}>
        <View style={s.avatarPreview}>
          <Text style={[s.avatarBody, { color: mine.color }]}>{mine.outfit}</Text>
          {mine.hat !== 'بدون' && <Text style={s.avatarHat}>{mine.hat}</Text>}
          <Text style={s.avatarName}>{myName}</Text>
        </View>
        {partnerOutfit && (
          <View style={s.avatarPreview}>
            <Text style={[s.avatarBody, { color: partnerOutfit.color }]}>{partnerOutfit.outfit}</Text>
            {partnerOutfit.hat !== 'بدون' && <Text style={s.avatarHat}>{partnerOutfit.hat}</Text>}
            <Text style={s.avatarName}>شريكك</Text>
          </View>
        )}
      </View>

      <Text style={s.sectionLabel}>شكل الملابس</Text>
      <View style={s.optionRow}>
        {OUTFIT_OPTIONS.map((o) => (
          <Pressable
            key={o}
            style={[s.optionCell, mine.outfit === o && s.optionCellActive]}
            onPress={() => setOutfit(coupleId, uid, mine.color, mine.hat, o)}
            accessibilityRole="button"
            accessibilityLabel={`شكل ملابس ${o}`}
            accessibilityState={{ selected: mine.outfit === o }}
          >
            <Text style={{ fontSize: 24 }}>{o}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={s.sectionLabel}>القبعة</Text>
      <View style={s.optionRow}>
        {HAT_OPTIONS.map((h) => (
          <Pressable
            key={h}
            style={[s.optionCell, mine.hat === h && s.optionCellActive]}
            onPress={() => setOutfit(coupleId, uid, mine.color, h, mine.outfit)}
            accessibilityRole="button"
            accessibilityLabel={h === 'بدون' ? 'بدون قبعة' : `قبعة ${h}`}
            accessibilityState={{ selected: mine.hat === h }}
          >
            <Text style={{ fontSize: h === 'بدون' ? 12 : 24 }}>{h}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={s.sectionLabel}>اللون</Text>
      <View style={s.optionRow}>
        {COLOR_OPTIONS.map((c) => (
          <Pressable
            key={c}
            style={[s.colorCell, { backgroundColor: c }, mine.color === c && s.colorCellActive]}
            onPress={() => setOutfit(coupleId, uid, c, mine.hat, mine.outfit)}
            accessibilityRole="button"
            accessibilityLabel={`لون ${c}`}
            accessibilityState={{ selected: mine.color === c }}
          />
        ))}
      </View>
    </View>
  );
}
