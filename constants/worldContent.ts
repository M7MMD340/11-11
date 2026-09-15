export const PLANT_CATALOG: { kind: 'rose' | 'tulip' | 'cactus' | 'sunflower' | 'tree'; label: string; cost: number; stages: string[] }[] = [
  { kind: 'rose', label: 'وردة', cost: 3, stages: ['🌱', '🌿', '🌹'] },
  { kind: 'tulip', label: 'توليب', cost: 3, stages: ['🌱', '🌿', '🌷'] },
  { kind: 'sunflower', label: 'دوّار الشمس', cost: 4, stages: ['🌱', '🌿', '🌻'] },
  { kind: 'cactus', label: 'صبار', cost: 2, stages: ['🌱', '🪴', '🌵'] },
  { kind: 'tree', label: 'شجرة', cost: 6, stages: ['🌱', '🌿', '🌳'] },
];

export function plantStageEmoji(kind: string, plantedAt: number) {
  const item = PLANT_CATALOG.find((p) => p.kind === kind) ?? PLANT_CATALOG[0];
  const hours = (Date.now() - plantedAt) / (1000 * 60 * 60);
  if (hours < 1) return item.stages[0];
  if (hours < 6) return item.stages[1];
  return item.stages[2];
}

export const FURNITURE_CATALOG: { kind: string; label: string; emoji: string; cost: number }[] = [
  { kind: 'sofa', label: 'أريكة', emoji: '🛋️', cost: 8 },
  { kind: 'pot', label: 'أصيص', emoji: '🪴', cost: 4 },
  { kind: 'lamp', label: 'إضاءة', emoji: '💡', cost: 5 },
  { kind: 'tv', label: 'تلفاز', emoji: '📺', cost: 10 },
  { kind: 'bed', label: 'سرير', emoji: '🛏️', cost: 12 },
  { kind: 'table', label: 'طاولة', emoji: '🪑', cost: 6 },
  { kind: 'painting', label: 'لوحة', emoji: '🖼️', cost: 7 },
  { kind: 'rug', label: 'سجادة', emoji: '🧺', cost: 5 },
  { kind: 'books', label: 'مكتبة', emoji: '📚', cost: 9 },
  { kind: 'fireplace', label: 'مدفأة', emoji: '🔥', cost: 14 },
];

export const OUTFIT_OPTIONS = ['👕', '👗', '🥼', '🎽', '🧥'];
export const HAT_OPTIONS = ['بدون', '🎩', '🧢', '👒', '👑'];
export const COLOR_OPTIONS = ['#E8607A', '#7C6BC4', '#F6B33C', '#4CAF7D', '#4A90D9', '#D96AA8'];

export function houseCapacity(roomLevel: number) {
  return 6 + roomLevel * 4;
}

export function expandCost(roomLevel: number) {
  return 10 + roomLevel * 5;
}
