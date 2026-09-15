import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { WorldState } from '../../lib/types';
import { ensureWorldExists } from '../../lib/worldActions';
import { Screen, Title, GradientHeader, SegmentedTabs } from '../../components/ui';
import { spacing, TAB_BAR_CLEARANCE } from '../../constants/theme';
import { worldStyles } from '../../components/world/styles';
import { GardenSection } from '../../components/world/GardenSection';
import { HouseSection } from '../../components/world/HouseSection';
import { AvatarEditor } from '../../components/world/AvatarEditor';

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

  if (!couple || !world || !user) {
    return (
      <Screen>
        <Title>بيتنا 🏡</Title>
      </Screen>
    );
  }

  return (
    <Screen>
      <GradientHeader
        title="بيتنا 🏡"
        subtitle="ابنوا بيتكم وحديقتكم مع بعض"
        right={
          <View style={worldStyles.coinBadge} accessibilityLabel={`رصيدكم ${world.coins} نقطة`}>
            <Text style={worldStyles.coinText}>{world.coins} 🪙</Text>
          </View>
        }
      />

      <SegmentedTabs
        options={[
          { key: 'garden', label: 'الحديقة 🌿' },
          { key: 'house', label: 'المنزل 🛋️' },
          { key: 'avatars', label: 'شخصياتنا 👗' },
        ]}
        value={section}
        onChange={setSection}
      />
      <View style={{ height: spacing(2) }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}>
        {section === 'garden' && (
          <GardenSection coupleId={couple.id} plants={world.plants} coins={world.coins} />
        )}
        {section === 'house' && (
          <HouseSection
            coupleId={couple.id}
            furniture={world.furniture}
            coins={world.coins}
            roomLevel={world.roomLevel ?? 1}
          />
        )}
        {section === 'avatars' && (
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
