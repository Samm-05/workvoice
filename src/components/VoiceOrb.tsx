import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { AudioWaveform, Mic } from 'lucide-react-native';
import { colors, radii, typography } from '../theme/tokens';

interface VoiceOrbProps {
  isRecording?: boolean;
  caption?: string;
  onPress?: () => void;
  size?: number;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isRecording = true,
  caption = 'Listening…',
  onPress,
  size = 96,
}) => {
  const pulseScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.4);
  const ringScale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.96, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      ringScale.value = withRepeat(
        withTiming(1.35, { duration: 1200, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );

      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.35, { duration: 200 }),
          withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(pulseScale);
      cancelAnimation(ringScale);
      cancelAnimation(ringOpacity);
      pulseScale.value = withTiming(1);
      ringScale.value = 1;
      ringOpacity.value = 0;
    }

    return () => {
      cancelAnimation(pulseScale);
      cancelAnimation(ringScale);
      cancelAnimation(ringOpacity);
    };
  }, [isRecording]);

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={onPress} style={styles.centerContainer}>
        {/* Outer ambient wave ring */}
        {isRecording && (
          <Animated.View
            style={[
              styles.ambientRing,
              {
                width: size + 28,
                height: size + 28,
                borderRadius: (size + 28) / 2,
              },
              animatedRingStyle,
            ]}
          />
        )}

        {/* Central Black Voice Orb */}
        <Animated.View
          style={[
            styles.orb,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            animatedOrbStyle,
          ]}
        >
          {isRecording ? (
            <AudioWaveform size={size * 0.45} color={colors.onPrimary} strokeWidth={2.2} />
          ) : (
            <Mic size={size * 0.42} color={colors.onPrimary} strokeWidth={2} />
          )}
        </Animated.View>
      </Pressable>

      {caption ? (
        <Text style={styles.captionText}>{caption}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
  },
  orb: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  ambientRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.25)',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  captionText: {
    ...typography.meta,
    color: colors.textTertiary,
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

