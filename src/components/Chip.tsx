import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, radii, elevation, StatusType } from '../theme/tokens';

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
  outlined?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  onPress,
  active = false,
  outlined = false,
  style,
  textStyle,
}) => {
  const content = (
    <View style={styles.innerRow}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          active && styles.activeText,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: elevation.ripple }}
        style={({ pressed }) => [
          styles.base,
          outlined ? styles.outlined : styles.filled,
          active && styles.activeChip,
          pressed && styles.pressed,
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.base,
        outlined ? styles.outlined : styles.filled,
        active && styles.activeChip,
        style,
      ]}
    >
      {content}
    </View>
  );
};

interface StatusChipProps {
  status: StatusType;
  label?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

const statusDefaultLabels: Record<StatusType, string> = {
  success: 'Operational',
  warning: 'Needs Review',
  danger: 'Critical Fault',
  info: 'Information',
  neutral: 'Pending',
};

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  label,
  icon,
  onPress,
  style,
}) => {
  const statusTheme = colors.status[status] || colors.status.neutral;
  const displayLabel = label || statusDefaultLabels[status];

  const content = (
    <View style={styles.innerRow}>
      {icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ) : (
        <View style={[styles.statusDot, { backgroundColor: statusTheme.text }]} />
      )}
      <Text
        style={[styles.text, { color: statusTheme.text, fontWeight: '600' }]}
        numberOfLines={1}
      >
        {displayLabel}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: elevation.ripple }}
        style={({ pressed }) => [
          styles.base,
          { backgroundColor: statusTheme.bg },
          pressed && styles.pressed,
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.base, { backgroundColor: statusTheme.bg }, style]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  filled: {
    backgroundColor: colors.surfaceMuted,
  },
  outlined: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  activeText: {
    color: colors.onPrimary,
  },
  pressed: {
    opacity: 0.8,
  },
});

