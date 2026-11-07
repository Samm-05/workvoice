export const colors = {
  // Global Design System Colors
  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F4F6',
  border: '#E5E7EB',
  divider: '#E5E7EB',
  text: '#111827',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  muted: '#6B7280',
  primary: '#2563EB',
  onPrimary: '#FFFFFF',
  primaryMuted: '#DBEAFE',

  // Hero / accent
  accentHero: '#F5A623',
  accentBlue: {
    bg: '#DBEAFE',
    text: '#1D4ED8',
  },
  overlayScrim: 'rgba(0,0,0,0.5)',
  imageGradient: ['transparent', 'rgba(0,0,0,0.7)'] as const,
  heartRed: '#EF4444',
  disabled: '#E5E7EB',
  disabledText: '#9CA3AF',

  // Status colors (soft tinted background + darker text)
  status: {
    draft: {
      text: '#4B5563',
      bg: '#F3F4F6',
    },
    submitted: {
      text: '#B45309',
      bg: '#FEF3C7',
    },
    approved: {
      text: '#047857',
      bg: '#D1FAE5',
    },
    rejected: {
      text: '#B91C1C',
      bg: '#FEE2E2',
    },
    operational: {
      text: '#047857',
      bg: '#D1FAE5',
    },
    maintenance_req: {
      text: '#B45309',
      bg: '#FEF3C7',
    },
    success: {
      text: '#047857',
      bg: '#D1FAE5',
    },
    warning: {
      text: '#B45309',
      bg: '#FEF3C7',
    },
    danger: {
      text: '#B91C1C',
      bg: '#FEE2E2',
    },
    info: {
      text: '#1D4ED8',
      bg: '#DBEAFE',
    },
    neutral: {
      text: '#4B5563',
      bg: '#F3F4F6',
    },
  },
} as const;

export type StatusType = keyof typeof colors.status;

export const typography = {
  // Global Design System Typography
  screenTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    color: colors.text,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    color: colors.text,
  },
  bodyStrong: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    color: colors.muted,
  },
  captionStrong: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    color: colors.muted,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    color: colors.text,
  },
  labelBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    color: colors.muted,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
  },
  display: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    color: colors.text,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    color: colors.text,
  },
  sectionHdr: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    color: colors.text,
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
  cardPadding: 16,
  cardGap: 12,
  sectionGap: 24,
} as const;

export const radii = {
  card: 16,
  imageCard: 16,
  pill: 999,
  button: 12,
  input: 12,
  smallThumb: 8,
  bottomSheet: 24,
  modal: 16,
  avatar: 999,
} as const;

export const elevation = {
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  flat: {
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 0,
  },
  sheet: {
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  fab: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
  ripple: 'rgba(37, 99, 235, 0.08)',
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  elevation,
} as const;

export default tokens;
