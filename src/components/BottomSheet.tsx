import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors, radii, elevation, typography } from '../theme/tokens';
import { IconButton } from './Button';

interface CustomBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  maxHeightRatio?: number;
  contentContainerStyle?: ViewStyle;
}

export const BottomSheet: React.FC<CustomBottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  maxHeightRatio = 0.88,
  contentContainerStyle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.scrim}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View
                style={[
                  styles.sheetContainer,
                  { maxHeight: `${Math.round(maxHeightRatio * 100)}%` as any },
                ]}
              >
                {/* Grabber indicator */}
                <View style={styles.grabberRow}>
                  <View style={styles.grabber} />
                </View>

                {/* Header row with Close button on left (per Mindtrip pattern) */}
                <View style={styles.sheetHeader}>
                  {showCloseButton ? (
                    <IconButton
                      icon={<X size={18} color={colors.textPrimary} strokeWidth={2.2} />}
                      onPress={onClose}
                      size={36}
                      bg={colors.surfaceMuted}
                    />
                  ) : (
                    <View style={{ width: 36 }} />
                  )}

                  {title && (
                    <Text style={styles.sheetTitle} numberOfLines={1}>
                      {title}
                    </Text>
                  )}

                  <View style={{ width: 36 }} />
                </View>

                {/* Content body */}
                <ScrollView
                  contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {children}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrim: {
    flex: 1,
    backgroundColor: colors.overlayScrim,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.bottomSheet,
    borderTopRightRadius: radii.bottomSheet,
    paddingBottom: 24,
    ...elevation.sheet,
  },
  grabberRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  sheetTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
