import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, StatusType } from '../theme/tokens';

export type StatusPillVariant =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'operational'
  | 'maintenance_req'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

interface StatusPillProps {
  status: string;
  label?: string;
  showDot?: boolean;
  style?: ViewStyle;
}

const statusThemes: Record<string, { bg: string; text: string; label: string }> = {
  draft: {
    bg: '#F3F4F6',
    text: '#4B5563',
    label: 'Draft',
  },
  submitted: {
    bg: '#FEF3C7',
    text: '#B45309',
    label: 'Submitted',
  },
  approved: {
    bg: '#D1FAE5',
    text: '#047857',
    label: 'Approved',
  },
  rejected: {
    bg: '#FEE2E2',
    text: '#B91C1C',
    label: 'Rejected',
  },
  operational: {
    bg: '#D1FAE5',
    text: '#047857',
    label: 'Operational',
  },
  maintenance_req: {
    bg: '#FEF3C7',
    text: '#B45309',
    label: 'Maintenance Req',
  },
  success: {
    bg: '#D1FAE5',
    text: '#047857',
    label: 'Passed',
  },
  warning: {
    bg: '#FEF3C7',
    text: '#B45309',
    label: 'Needs Review',
  },
  danger: {
    bg: '#FEE2E2',
    text: '#B91C1C',
    label: 'Critical',
  },
  info: {
    bg: '#DBEAFE',
    text: '#1D4ED8',
    label: 'In Review',
  },
  neutral: {
    bg: '#F3F4F6',
    text: '#4B5563',
    label: 'Pending',
  },
};

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  label,
  showDot = true,
  style,
}) => {
  const normalizedKey = (status || 'neutral').toLowerCase().replace(/[\s-]/g, '_');
  const theme = statusThemes[normalizedKey] || statusThemes.neutral;
  const displayLabel = label || theme.label;

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: theme.bg },
        style,
      ]}
    >
      {showDot && <View style={[styles.dot, { backgroundColor: theme.text }]} />}
      <Text
        style={[styles.label, { color: theme.text }]}
        numberOfLines={1}
      >
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});
