import React from 'react';
import {
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radii, typography, spacing } from '../theme/tokens';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  style?: ViewStyle;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selectedId,
  onSelect,
  style,
}) => {
  return (
    <View style={[styles.wrapper, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {options.map((option) => {
          const isSelected = option.id === selectedId;
          const displayLabel =
            option.count !== undefined ? `${option.label} ${option.count}` : option.label;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
              android_ripple={{ color: 'rgba(37, 99, 235, 0.12)', borderless: false }}
              style={({ pressed }) => [
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
                numberOfLines={1}
              >
                {displayLabel}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  chipTextUnselected: {
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.85,
  },
});
