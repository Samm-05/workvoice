import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, radii, typography, elevation } from '../theme/tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.primaryDisabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.primaryText,
              icon ? { marginLeft: 8 } : null,
              textStyle,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: elevation.ripple }}
      style={({ pressed }) => [
        styles.secondaryButton,
        disabled && styles.secondaryDisabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.secondaryText,
              icon ? { marginLeft: 8 } : null,
              textStyle,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

export const OutlinedButton: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: elevation.ripple }}
      style={({ pressed }) => [
        styles.outlinedButton,
        disabled && styles.secondaryDisabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.outlinedText,
              icon ? { marginLeft: 8 } : null,
              textStyle,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  bg?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  disabled = false,
  size = 44,
  bg = colors.surfaceMuted,
  accessibilityLabel = 'Button',
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={4}
      android_ripple={{ color: elevation.ripple, borderless: true, radius: size / 2 }}
      style={({ pressed }) => [
        styles.iconButton,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
        pressed && !disabled && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    height: 48,
    width: '100%',
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: 44,
  },
  primaryDisabled: {
    backgroundColor: colors.disabled,
  },
  primaryText: {
    ...typography.labelBold,
    color: colors.onPrimary,
  },
  secondaryButton: {
    height: 48,
    width: '100%',
    borderRadius: radii.button,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: 44,
  },
  secondaryDisabled: {
    opacity: 0.5,
  },
  secondaryText: {
    ...typography.labelBold,
    color: colors.textPrimary,
  },
  outlinedButton: {
    height: 48,
    width: '100%',
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: 44,
  },
  outlinedText: {
    ...typography.labelBold,
    color: colors.textPrimary,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  pressed: {
    opacity: 0.85,
  },
});
