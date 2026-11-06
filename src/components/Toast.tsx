import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { CheckCircle2 } from 'lucide-react-native';
import { colors, radii, typography, elevation } from '../theme/tokens';
import { useInspectionStore } from '../store/inspectionStore';

export const Toast: React.FC = () => {
  const toastMessage = useInspectionStore((state) => state.toastMessage);

  if (!toastMessage) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      exiting={FadeOutDown.duration(200)}
      style={styles.toastContainer}
      pointerEvents="none"
    >
      <View style={styles.toastPill}>
        <CheckCircle2 size={16} color={colors.onPrimary} strokeWidth={2.2} />
        <Text style={styles.toastText} numberOfLines={2}>
          {toastMessage}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 84,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radii.pill,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    ...typography.label,
    color: colors.onPrimary,
    fontSize: 13,
  },
});
