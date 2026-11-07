import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Plus, Mic, Send } from 'lucide-react-native';
import { colors, radii, typography, elevation } from '../theme/tokens';

interface VoiceInputBarProps {
  onAttachPhoto?: () => void;
  onStartVoice?: () => void;
  onSubmitText?: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  onAttachPhoto,
  onStartVoice,
  onSubmitText,
  placeholder = 'Ask anything or record voice note…',
  style,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && onSubmitText) {
      onSubmitText(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Leading '+' icon */}
      <Pressable
        onPress={onAttachPhoto}
        hitSlop={6}
        android_ripple={{ color: elevation.ripple, borderless: true, radius: 20 }}
        style={styles.actionButton}
        accessibilityRole="button"
        accessibilityLabel="Attach photo or document"
      >
        <Plus size={20} color={colors.textSecondary} strokeWidth={2.2} />
      </Pressable>

      {/* Input Field */}
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />

      {/* Trailing Controls */}
      <View style={styles.rightGroup}>
        {text.trim().length > 0 ? (
          <Pressable
            onPress={handleSend}
            hitSlop={6}
            android_ripple={{ color: elevation.ripple, borderless: true, radius: 20 }}
            style={styles.sendButton}
            accessibilityRole="button"
            accessibilityLabel="Send text query"
          >
            <Send size={18} color={colors.primary} strokeWidth={2.2} />
          </Pressable>
        ) : (
          <Pressable
            onPress={onStartVoice}
            hitSlop={6}
            android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true, radius: 20 }}
            style={styles.micCircle}
            accessibilityRole="button"
            accessibilityLabel="Record voice inspection"
          >
            <Mic size={18} color={colors.onPrimary} strokeWidth={2.2} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    paddingHorizontal: 6,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
