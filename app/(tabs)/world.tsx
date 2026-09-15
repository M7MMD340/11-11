import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { WorldState } from '../../lib/types';
import {
  ensureWorldExists,
  plantSeed,
  waterPlant,
  removePlant,
  buyFurniture,
  removeFurniture,
  setOutfit,
  expandHouse,
} from '../../lib/worldActions';
import {
  PLANT_CATALOG,
  plantStageEmoji,
  FURNITURE_CATALOG,
  OUTFIT_OPTIONS,
  HAT_OPTIONS,
  COLOR_OPTIONS,
  houseCapacity,
  expandCost,
} from '../../constants/worldContent';
import { Screen, Title, Card, Button, GradientHeader } from '../../components/ui';
import { colors, spacing } from '../../constants/theme';

type Section = 'garden' | 'house' | 'avatars';

export default function World() {
  const { user, couple, partnerId, profile } = useAuth();
  const [world, setWorld] = useState<WorldState | null>(null);
  const [section, setSection] = useState<Section>('garden');

  useEffect(() => {
    if (!couple) return;
    ensureWorldExists(couple.id);
    const unsub = onSnapshot(doc(db, 'couples', couple.id, 'world', 'state'), (snap) => {
      setWorld(snap.exists() ? (snap.data() as WorldState) : null);
    });
    return unsub;
  }, [couple]);

  if (!couple || !world) {
    return (
      <Screen>
        <Title>بيتنا 🏡</Title>
      </Screen>
    );
  }

  const capacity = houseCapacity(world.roomLevel ?? 1);
  const furnitureFull = world.furniture.length >= capacity;

  return (
    <Screen>
      <GradientHeader
        title="بيتنا 🏡"
        subtitle="ابنوا بيتكم وحديقتكم مع بعض"
        right={
          <View style={styles.coinBadge}>
            <Text style={styles.coinText}>{world.coins} 🪙</Text>
          </View>
        }
      />

      <View style={styles.tabs}>
        {([
          ['garden', 'الحديقة 🌿'],
          ['house', 'المنزل 🛋️'],
          ['avatars', 'شخصياتنا 👗'],
        ] as [Section, string][]).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setSection(key)}
            style={[styles.tabBtn, section === key && styles.tabBtnActive]}
          >
            <Text style={[styles.tabLabel, section === key && styles.tabLabelActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing(6) }}>
        {section === 'garden' && (
          <>
            <Card style={{ marginBottom: spacing(2) }}>
              {world.plants.length === 0 ? (
                <Text style={styles.emptyText}>ما فيه نباتات بعد، زرعوا أول واحدة!</Text>
              ) : (
                <View style={styles.plantGrid}>
                  {world.plants.map((p) => (
                    <Pressable
                      key={p.id}
                      style={styles.plantCell}
                      onPress={() => waterPlant(couple.id, world.plants, p.id)}
                      onLongPress={() => removePlant(couple.id, world.plants, p.id)}
                    >
                      <Text style={styles.plantEmoji}>{plantStageEmoji(p.kind, p.plantedAt)}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </Card>
            <Text style={styles.sectionLabel}>ازرعوا نبتة جديدة</Text>
            <View style={styles.shopGrid}>
              {PLANT_CATALOG.map((p) => (
                <Pressable
                  key={p.kind}
                  style={[styles.shopItem, world.coins < p.cost && styles.shopItemDisabled]}
                  disabled={world.coins < p.cost}
                  onPress={() => plantSeed(couple.id, p.kind, world.plants)}
                >
                  <Text style={styles.shopEmoji}>{p.stages[2]}</Text>
                  <Text style={styles.shopLabel}>{p.label}</Text>
                  <Text style={styles.shopCost}>{p.cost} 🪙</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {section === 'house' && (
          <>
            <Card style={{ marginBottom: spacing(2) }}>
              <Text style={styles.capacityText}>
                {world.furniture.length} / {capacity} قطعة
              </Text>
              <View style={styles.plantGrid}>
                {world.furniture.map((f) => {
                  const item = FURNITURE_CATALOG.find((c) => c.kind === f.kind);
                  return (
                    <Pressable
                      key={f.id}
                      style={styles.plantCell}
                      onLongPress={() => removeFurniture(couple.id, world.furniture, f.id)}
                    >
                      <Text style={styles.plantEmoji}>{item?.emoji ?? '📦'}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Button
                title={`وسّعوا بيتكم (${expandCost(world.roomLevel ?? 1)} 🪙)`}
                onPress={() => expandHouse(couple.id, world.roomLevel ?? 1, expandCost(world.roomLevel ?? 1))}
                variant="ghost"
                disabled={world.coins < expandCost(world.roomLevel ?? 1)}
              />
            </Card>
            <Text style={styles.sectionLabel}>تسوّقوا لبيتكم</Text>
            <View style={styles.shopGrid}>
              {FURNITURE_CATALOG.map((f) => (
                <Pressable
                  key={f.kind}
                  style={[styles.shopItem, (world.coins < f.cost || furnitureFull) && styles.shopItemDisabled]}
                  disabled={world.coins < f.cost || furnitureFull}
                  onPress={() => buyFurniture(couple.id, world.furniture, f.kind, f.cost, 0, 0)}
                >
                  <Text style={styles.shopEmoji}>{f.emoji}</Text>
                  <Text style={styles.shopLabel}>{f.label}</Text>
                  <Text style={styles.shopCost}>{f.cost} 🪙</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {section === 'avatars' && user && (
          <AvatarEditor
            coupleId={couple.id}
            uid={user.uid}
            partnerId={partnerId}
            world={world}
            myName={profile?.displayName ?? 'أنا'}
          />
        )}
      </ScrollView>
    </Screen>
  );
}

function AvatarEditor({
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
      <View style={styles.avatarRow}>
        <View style={styles.avatarPreview}>
          <Text style={[styles.avatarBody, { color: mine.color }]}>{mine.outfit}</Text>
          {mine.hat !== 'بدون' && <Text style={styles.avatarHat}>{mine.hat}</Text>}
          <Text style={styles.avatarName}>{myName}</Text>
        </View>
        {partnerOutfit && (
          <View style={styles.avatarPreview}>
            <Text style={[styles.avatarBody, { color: partnerOutfit.color }]}>{partnerOutfit.outfit}</Text>
            {partnerOutfit.hat !== 'بدون' && <Text style={styles.avatarHat}>{partnerOutfit.hat}</Text>}
            <Text style={styles.avatarName}>شريكك</Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionLabel}>شكل الملابس</Text>
      <View style={styles.optionRow}>
        {OUTFIT_OPTIONS.map((o) => (
          <Pressable
            key={o}
            style={[styles.optionCell, mine.outfit === o && styles.optionCellActive]}
            onPress={() => setOutfit(coupleId, uid, mine.color, mine.hat, o)}
          >
            <Text style={{ fontSize: 24 }}>{o}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>القبعة</Text>
      <View style={styles.optionRow}>
        {HAT_OPTIONS.map((h) => (
          <Pressable
            key={h}
            style={[styles.optionCell, mine.hat === h && styles.optionCellActive]}
            onPress={() => setOutfit(coupleId, uid, mine.color, h, mine.outfit)}
          >
            <Text style={{ fontSize: h === 'بدون' ? 12 : 24 }}>{h}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>اللون</Text>
      <View style={styles.optionRow}>
        {COLOR_OPTIONS.map((c) => (
          <Pressable
            key={c}
            style={[styles.colorCell, { backgroundColor: c }, mine.color === c && styles.colorCellActive]}
            onPress={() => setOutfit(coupleId, uid, c, mine.hat, mine.outfit)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coinBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 20,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.75),
  },
  coinText: { fontWeight: '700', color: '#fff' },
  tabs: { flexDirection: 'row', gap: 8, marginVertical: spacing(2) },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing(1.25),
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabLabel: { color: colors.muted, fontWeight: '600', fontSize: 13 },
  tabLabelActive: { color: '#fff' },
  emptyText: { textAlign: 'center', color: colors.muted },
  plantGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  plantCell: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F3FBF6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  plantEmoji: { fontSize: 26 },
  sectionLabel: { fontWeight: '700', color: colors.text, marginBottom: spacing(1), marginTop: spacing(1), textAlign: 'right' },
  shopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  shopItem: {
    width: 88,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: spacing(1.5),
    borderWidth: 1,
    borderColor: colors.border,
  },
  shopItemDisabled: { opacity: 0.4 },
  shopEmoji: { fontSize: 28, marginBottom: 4 },
  shopLabel: { fontSize: 12, color: colors.text, fontWeight: '600' },
  shopCost: { fontSize: 11, color: colors.muted, marginTop: 2 },
  capacityText: { textAlign: 'right', color: colors.muted, marginBottom: spacing(1) },
  avatarRow: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginBottom: spacing(2) },
  avatarPreview: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.border,
    width: 120,
  },
  avatarBody: { fontSize: 44 },
  avatarHat: { fontSize: 20, position: 'absolute', top: 10 },
  avatarName: { marginTop: spacing(1), color: colors.muted, fontSize: 12 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing(1) },
  optionCell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionCellActive: { borderColor: colors.primary, borderWidth: 2 },
  colorCell: { width: 36, height: 36, borderRadius: 18 },
  colorCellActive: { borderWidth: 3, borderColor: colors.text },
});
