import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LucideIcon, Inbox } from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../theme/tokens';
import { PrimaryButton } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onPressAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onPressAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Icon size={28} color={colors.textSecondary} strokeWidth={1.75} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionLabel && onPressAction && (
        <View style={styles.actionWrapper}>
          <PrimaryButton label={actionLabel} onPress={onPressAction} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...typography.cardTitle,
    textAlign: 'center',
    color: colors.text,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 6,
    maxWidth: 280,
  },
  actionWrapper: {
    marginTop: 20,
    width: '100%',
    maxWidth: 220,
  },
});
