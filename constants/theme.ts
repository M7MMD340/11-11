export const APP_NAME = 'M-A · 11/11';
export const APP_SHORT_NAME = 'M-A';
export const APP_DATE = '11 · 11';

// "ليلي عصري غامق" — a modern dark theme: near-black violet ground,
// hot-pink primary, warm gold accent, cool purple secondary.
export const colors = {
  bg: '#15111A',
  bgAlt: '#1C1622',
  card: '#211A29',
  cardAlt: '#2A2233',
  primary: '#FF3D77',
  primaryDark: '#D42D5F',
  secondary: '#7B61FF',
  secondaryLight: '#9B85FF',
  accent: '#FFD166',
  text: '#F5F0F7',
  muted: '#9C8FAE',
  border: '#362B44',
  success: '#4ADE80',
  danger: '#FF6B6B',
};

export const gradients = {
  hero: ['#4A2A7A', '#FF3D77'] as const,
  gold: ['#FFD166', '#FF3D77'] as const,
  night: ['#15111A', '#4A2A7A'] as const,
};

export const shadow = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 3,
  },
  lift: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 22,
    elevation: 8,
  },
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

export const spacing = (n: number) => n * 8;

// Clearance so scrollable content isn't hidden behind the floating tab bar.
export const TAB_BAR_CLEARANCE = 110;
