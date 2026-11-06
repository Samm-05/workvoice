import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Menu, ArrowLeft, ChevronDown, Sparkles } from 'lucide-react-native';
import { colors, typography, elevation } from '../theme/tokens';
import { IconButton } from './Button';

interface HeaderBarProps {
  title?: string;
  isDropdown?: boolean;
  onPressDropdown?: () => void;
  showBack?: boolean;
  onPressBack?: () => void;
  onPressMenu?: () => void;
  rightAction?: React.ReactNode;
  rightAction2?: React.ReactNode;
  showLogo?: boolean;
  style?: ViewStyle;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  isDropdown = false,
  onPressDropdown,
  showBack = false,
  onPressBack,
  onPressMenu,
  rightAction,
  rightAction2,
  showLogo = false,
  style,
}) => {
  return (
    <View style={[styles.headerContainer, style]}>
      {/* Left button */}
      <View style={styles.leftContainer}>
        {showBack ? (
          <IconButton
            icon={<ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2} />}
            onPress={onPressBack || (() => {})}
            size={40}
            bg="transparent"
          />
        ) : (
          <IconButton
            icon={<Menu size={22} color={colors.textPrimary} strokeWidth={2} />}
            onPress={onPressMenu || (() => {})}
            size={40}
            bg="transparent"
          />
        )}
      </View>

      {/* Center Title or Logo */}
      <View style={styles.centerContainer}>
        {showLogo ? (
          <View style={styles.logoRow}>
            <Sparkles size={16} color={colors.primary} strokeWidth={2.5} style={{ marginRight: 6 }} />
            <Text style={styles.logoText}>workvoice</Text>
          </View>
        ) : isDropdown ? (
          <Pressable
            onPress={onPressDropdown}
            android_ripple={{ color: elevation.ripple }}
            style={styles.dropdownButton}
          >
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            <ChevronDown size={16} color={colors.textPrimary} strokeWidth={2} />
          </Pressable>
        ) : (
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      {/* Right Actions */}
      <View style={styles.rightContainer}>
        {rightAction2}
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftContainer: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  titleText: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rightContainer: {
    minWidth: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
});
