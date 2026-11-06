import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Plus, Mic, Send } from 'lucide-react-native';
import { colors, radii, typography, elevation } from '../theme/tokens';

interface InputBarProps {
  onAttachPhoto?: () => void;
  onStartVoice?: () => void;
  onSubmitText?: (text: string) => void;
  placeholder?: string;
}

export const InputBar: React.FC<InputBarProps> = ({
  onAttachPhoto,
  onStartVoice,
  onSubmitText,
  placeholder = 'Ask anything…',
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && onSubmitText) {
      onSubmitText(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onAttachPhoto}
        android_ripple={{ color: elevation.ripple, borderless: true, radius: 18 }}
        style={styles.plusButton}
        accessibilityLabel="Attach photo"
      >
        <Plus size={20} color={colors.textPrimary} strokeWidth={2} />
      </Pressable>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />

      <View style={styles.rightActions}>
        <Pressable
          onPress={onStartVoice}
          android_ripple={{ color: elevation.ripple, borderless: true, radius: 16 }}
          style={styles.micCircle}
          accessibilityLabel="Start voice note"
        >
          <Mic size={17} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>

        {text.trim().length > 0 && (
          <Pressable
            onPress={handleSend}
            android_ripple={{ color: elevation.ripple, borderless: true, radius: 16 }}
            style={styles.sendButton}
            accessibilityLabel="Send"
          >
            <Send size={18} color={colors.primary} strokeWidth={2} />
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
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 8,
    ...typography.body,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  micCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
