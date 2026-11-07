import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { colors, typography, radii } from '../theme/tokens';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onPressBack?: () => void;
  rightAction?: React.ReactNode;
  rightAction2?: React.ReactNode;
  subtitle?: string;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onPressBack,
  rightAction,
  rightAction2,
  subtitle,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.safeWrapper,
        { paddingTop: insets.top },
        style,
      ]}
    >
      <View style={styles.container}>
        {/* Left: Back button or Title */}
        <View style={styles.leftContainer}>
          {showBack && (
            <Pressable
              onPress={onPressBack}
              hitSlop={8}
              android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true, radius: 22 }}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={22} color={colors.text} strokeWidth={2} />
            </Pressable>
          )}
          <View style={styles.titleWrap}>
            <Text
              style={styles.titleText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Right: At most 2 actions */}
        <View style={styles.rightContainer}>
          {rightAction2}
          {rightAction}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeWrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginLeft: -8,
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    ...typography.screenTitle,
  },
  subtitleText: {
    ...typography.caption,
    marginTop: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
