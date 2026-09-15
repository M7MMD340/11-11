import { View, Text, Pressable } from 'react-native';
import { PLANT_CATALOG, plantStageEmoji } from '../../constants/worldContent';
import { plantSeed, waterPlant, removePlant } from '../../lib/worldActions';
import { Plant } from '../../lib/types';
import { Card } from '../ui';
import { spacing } from '../../constants/theme';
import { worldStyles as s } from './styles';

export function GardenSection({
  coupleId,
  plants,
  coins,
}: {
  coupleId: string;
  plants: Plant[];
  coins: number;
}) {
  return (
    <>
      <Card style={{ marginBottom: spacing(2) }}>
        {plants.length === 0 ? (
          <Text style={s.emptyText} accessibilityRole="text">
            ما فيه نباتات بعد، زرعوا أول واحدة!
          </Text>
        ) : (
          <View style={s.plantGrid}>
            {plants.map((p) => (
              <Pressable
                key={p.id}
                style={s.plantCell}
                onPress={() => waterPlant(coupleId, plants, p.id)}
                onLongPress={() => removePlant(coupleId, plants, p.id)}
                accessibilityRole="button"
                accessibilityLabel={`اسقوا نبتة ${p.kind}، اضغطوا مطولاً للإزالة`}
              >
                <Text style={s.plantEmoji}>{plantStageEmoji(p.kind, p.plantedAt)}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </Card>
      <Text style={s.sectionLabel}>ازرعوا نبتة جديدة</Text>
      <View style={s.shopGrid}>
        {PLANT_CATALOG.map((p) => (
          <Pressable
            key={p.kind}
            style={[s.shopItem, coins < p.cost && s.shopItemDisabled]}
            disabled={coins < p.cost}
            onPress={() => plantSeed(coupleId, p.kind, plants)}
            accessibilityRole="button"
            accessibilityLabel={`ازرعوا ${p.label} مقابل ${p.cost} نقطة`}
            accessibilityState={{ disabled: coins < p.cost }}
          >
            <Text style={s.shopEmoji}>{p.stages[2]}</Text>
            <Text style={s.shopLabel}>{p.label}</Text>
            <Text style={s.shopCost}>{p.cost} 🪙</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
