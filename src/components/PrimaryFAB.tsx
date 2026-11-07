import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors, radii, elevation } from '../theme/tokens';

interface PrimaryFABProps {
  label?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const PrimaryFAB: React.FC<PrimaryFABProps> = ({
  label = 'New inspection',
  onPress,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
      style={({ pressed }) => [
        styles.fab,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Plus size={20} color={colors.onPrimary} strokeWidth={2.4} />
      <Text style={styles.fabText}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...elevation.fab,
    minWidth: 44,
    minHeight: 44,
  },
  fabText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
