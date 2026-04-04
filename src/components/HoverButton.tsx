import React, { useState } from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

type Props = {
  onPress: () => void;
  label: React.ReactNode;
  primary?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export default function HoverButton({
  onPress,
  label,
  primary = false,
  style,
  textStyle,
  disabled = false,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const isGreen = primary || hovered;

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.85}
      style={[
        {
          backgroundColor: isGreen ? '#00ff00' : '#1a1a2e',
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 20,
          alignItems: 'center',
          borderWidth: 1.5,
          borderColor: isGreen ? '#00ff00' : '#2b4330',
          opacity: disabled ? 0.5 : 1,
          // @ts-ignore - web only
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          cursor: disabled ? 'not-allowed' : 'pointer',
        } as ViewStyle,
        style,
      ]}
      {...({
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      } as any)}
    >
      {typeof label === 'string' ? (
        <Text
          style={[
            {
              color: isGreen ? '#000000' : '#ffffff',
              fontWeight: '800',
              fontSize: 15,
              // @ts-ignore
              transition: 'color 0.15s ease',
            } as TextStyle,
            textStyle,
          ]}
        >
          {label}
        </Text>
      ) : (
        label
      )}
    </TouchableOpacity>
  );
}
