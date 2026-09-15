import { View, Text, Pressable } from 'react-native';
import { FURNITURE_CATALOG, houseCapacity, expandCost } from '../../constants/worldContent';
import { buyFurniture, removeFurniture, expandHouse } from '../../lib/worldActions';
import { FurnitureItem } from '../../lib/types';
import { Card, Button } from '../ui';
import { spacing } from '../../constants/theme';
import { worldStyles as s } from './styles';

export function HouseSection({
  coupleId,
  furniture,
  coins,
  roomLevel,
}: {
  coupleId: string;
  furniture: FurnitureItem[];
  coins: number;
  roomLevel: number;
}) {
  const capacity = houseCapacity(roomLevel);
  const furnitureFull = furniture.length >= capacity;
  const cost = expandCost(roomLevel);

  return (
    <>
      <Card style={{ marginBottom: spacing(2) }}>
        <Text style={s.capacityText}>
          {furniture.length} / {capacity} قطعة
        </Text>
        <View style={s.plantGrid}>
          {furniture.map((f) => {
            const item = FURNITURE_CATALOG.find((c) => c.kind === f.kind);
            return (
              <Pressable
                key={f.id}
                style={s.plantCell}
                onLongPress={() => removeFurniture(coupleId, furniture, f.id)}
                accessibilityRole="button"
                accessibilityLabel={`قطعة ${item?.label ?? f.kind}، اضغطوا مطولاً للإزالة`}
              >
                <Text style={s.plantEmoji}>{item?.emoji ?? '📦'}</Text>
              </Pressable>
            );
          })}
        </View>
        <Button
          title={`وسّعوا بيتكم (${cost} 🪙)`}
          onPress={() => expandHouse(coupleId, roomLevel, cost)}
          variant="ghost"
          disabled={coins < cost}
        />
      </Card>
      <Text style={s.sectionLabel}>تسوّقوا لبيتكم</Text>
      <View style={s.shopGrid}>
        {FURNITURE_CATALOG.map((f) => (
          <Pressable
            key={f.kind}
            style={[s.shopItem, (coins < f.cost || furnitureFull) && s.shopItemDisabled]}
            disabled={coins < f.cost || furnitureFull}
            onPress={() => buyFurniture(coupleId, furniture, f.kind, f.cost, 0, 0)}
            accessibilityRole="button"
            accessibilityLabel={`اشتروا ${f.label} مقابل ${f.cost} نقطة`}
            accessibilityState={{ disabled: coins < f.cost || furnitureFull }}
          >
            <Text style={s.shopEmoji}>{f.emoji}</Text>
            <Text style={s.shopLabel}>{f.label}</Text>
            <Text style={s.shopCost}>{f.cost} 🪙</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
