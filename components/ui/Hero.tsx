import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { stylesGlobal } from '../../styles/stylesGlobal';
import { AppText } from './AppText';

interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

// Encabezado de marca reutilizable: eyebrow + título serif + filete rosa + subtítulo,
// sobre un gradiente cálido crema → rosa (Dirección "A híbrida").
export function Hero({ eyebrow, title, subtitle }: HeroProps) {
  return (
    <LinearGradient
      colors={['#faf6ee', stylesGlobal.colors.primary[50] as string]}
      style={{ paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center' }}
    >
      {eyebrow ? (
        <AppText variant="eyebrow" style={{ marginBottom: 10, textAlign: 'center' }}>
          {eyebrow}
        </AppText>
      ) : null}

      <AppText variant="display" style={{ textAlign: 'center' }}>
        {title}
      </AppText>

      <View
        style={{
          width: 44,
          height: 2,
          backgroundColor: stylesGlobal.colors.primary[500] as string,
          borderRadius: 2,
          marginVertical: 14,
        }}
      />

      {subtitle ? (
        <AppText variant="body" style={{ textAlign: 'center', maxWidth: 300 }}>
          {subtitle}
        </AppText>
      ) : null}
    </LinearGradient>
  );
}

export default Hero;
