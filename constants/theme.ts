export const APP_NAME = 'M-A · 11/11';
export const APP_SHORT_NAME = 'M-A';
export const APP_DATE = '11 · 11';

export const colors = {
  bg: '#FBF3EE',
  bgAlt: '#F6E9E3',
  card: '#FFFFFF',
  primary: '#D94F6B',
  primaryDark: '#A6334E',
  secondary: '#5B4B8A',
  secondaryLight: '#8172C4',
  accent: '#E8B84B',
  text: '#2B1F2D',
  muted: '#8C7A85',
  border: '#F0DEE0',
  success: '#3F9C6D',
  danger: '#D9534F',
};

export const gradients = {
  hero: ['#A6334E', '#D94F6B', '#E8875F'] as const,
  gold: ['#E8B84B', '#D94F6B'] as const,
  night: ['#2B1F2D', '#5B4B8A'] as const,
};

export const shadow = {
  soft: {
    shadowColor: '#3D1F2A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  lift: {
    shadowColor: '#3D1F2A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
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
