import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Sparkles, AudioWaveform } from 'lucide-react-native';
import { colors, radii } from '../theme/tokens';

interface AvatarProps {
  initials?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials = 'SM',
  size = 32,
  style,
}) => {
  return (
    <View
      style={[
        styles.avatarContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.accentBlue.bg,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initialsText,
          {
            fontSize: size * 0.4,
            color: colors.accentBlue.text,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

interface AssistantMarkProps {
  size?: number;
  style?: ViewStyle;
}

export const AssistantMark: React.FC<AssistantMarkProps> = ({
  size = 28,
  style,
}) => {
  return (
    <View
      style={[
        styles.assistantContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
        },
        style,
      ]}
    >
      <Sparkles size={size * 0.55} color={colors.onPrimary} strokeWidth={2.2} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontWeight: '600',
  },
  assistantContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

