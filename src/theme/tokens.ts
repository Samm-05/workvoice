export const colors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F4F5',
  border: '#E5E5E7',
  textPrimary: '#0B0B0C',
  textSecondary: '#6B6B70',
  textTertiary: '#9A9AA0',
  primary: '#000000',
  onPrimary: '#FFFFFF',
  accentHero: '#F5A623',
  accentBlue: {
    bg: '#CFE3FF',
    text: '#2F6FED',
  },
  overlayScrim: 'rgba(0,0,0,0.55)',
  imageGradient: ['transparent', 'rgba(0,0,0,0.6)'] as const,
  heartRed: '#FF4D5E',
  disabled: '#C9C9CC',

  // Status colors
  status: {
    success: {
      text: '#1F9D55',
      bg: '#E8F6EE',
    },
    warning: {
      text: '#B7791F',
      bg: '#FDF3DC',
    },
    danger: {
      text: '#D64545',
      bg: '#FDECEC',
    },
    info: {
      text: '#2F6FED',
      bg: '#EAF1FE',
    },
    neutral: {
      text: '#6B6B70',
      bg: '#F4F4F5',
    },
  },
} as const;

export type StatusType = keyof typeof colors.status;

export const typography = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  sectionHdr: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    color: colors.textPrimary,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    color: colors.textPrimary,
  },
  labelBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  screenPadding: 16,
  sectionGap: 24,
  cardGap: 12,
} as const;

export const radii = {
  pill: 999,
  imageCard: 16,
  bottomSheet: 24,
  smallThumb: 8,
  avatar: 999,
  modal: 20,
  input: 12,
} as const;

export const elevation = {
  flat: {
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 0,
  },
  sheet: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  ripple: 'rgba(0,0,0,0.08)',
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  elevation,
} as const;

export default tokens;

