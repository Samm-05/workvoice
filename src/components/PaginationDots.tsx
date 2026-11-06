import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface PaginationDotsProps {
  total?: number;
  activeIndex: number;
  activeColor?: string;
  inactiveColor?: string;
  dotSize?: number;
  style?: ViewStyle;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  total = 5,
  activeIndex = 0,
  activeColor = '#FFFFFF',
  inactiveColor = 'rgba(255,255,255,0.5)',
  dotSize = 6,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: isActive ? dotSize * 1.5 : dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: isActive ? activeColor : inactiveColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  dot: {},
});
