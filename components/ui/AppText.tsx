import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { stylesGlobal } from '../../styles/stylesGlobal';

const f = stylesGlobal.typography.fonts;
const c = stylesGlobal.colors.text as { [k: string]: string };

// Variantes tipográficas de marca (Playfair para títulos, Inter para texto).
// Centraliza la jerarquía: en vez de <Text style={{fontSize,fontWeight,color}}> repetido.
const VARIANTS: { [k: string]: TextStyle } = {
  display: { fontFamily: f.serif, fontSize: 32, color: c.primary, lineHeight: 38 },
  h1: { fontFamily: f.serifSemi, fontSize: 26, color: c.primary, lineHeight: 32 },
  h2: { fontFamily: f.serifSemi, fontSize: 20, color: c.primary, lineHeight: 26 },
  eyebrow: {
    fontFamily: f.bodySemibold,
    fontSize: 11,
    color: c.accent,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  body: { fontFamily: f.body, fontSize: 15, color: c.secondary, lineHeight: 22 },
  bodyStrong: { fontFamily: f.bodySemibold, fontSize: 15, color: c.primary, lineHeight: 22 },
  bodyMuted: { fontFamily: f.body, fontSize: 13, color: c.tertiary, lineHeight: 19 },
  caption: { fontFamily: f.bodyMedium, fontSize: 12, color: c.muted },
};

export type AppTextVariant = keyof typeof VARIANTS;

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
}

export function AppText({ variant = 'body', style, ...rest }: AppTextProps) {
  return <Text style={[VARIANTS[variant], style]} {...rest} />;
}

export default AppText;
