import { Dimensions, StyleSheet } from 'react-native';

// Get screen dimensions for responsive calculations
const { width, height } = Dimensions.get('window');

// Define TypeScript interfaces for the style system
interface ColorPalette {
  [key: string]: string | { [key: string]: string };
}

interface Typography {
  families: {
    display: string;
    body: string;
    script: string;
    mono: string;
  };
  scale: { [key: string]: number };
  headings: { [key: string]: any };
  body: { [key: string]: any };
  weights: { [key: string]: number };
  leading: { [key: string]: number };
  tracking: { [key: string]: number };
}

interface Spacing {
  unit: number;
  scale: { [key: string]: string };
  sections: { [key: string]: number };
  margins: { [key: string]: number };
  gaps: { [key: string]: number };
}

interface Borders {
  radius: { [key: string]: string };
  width: { [key: string]: string };
  colors: { [key: string]: string };
}

interface Shadows {
  [key: string]: any;
}

interface Breakpoints {
  [key: string]: string;
}

interface Animations {
  duration: { [key: string]: string };
  easing: { [key: string]: string };
  transitions: { [key: string]: string };
}

interface Components {
  navbar: any;
  sidebar: any;
  footer: any;
  button: any;
  card: any;
  input: any;
  cssGlobals: { [key: string]: string };
}

interface Utils {
  container: any;
  zIndex: { [key: string]: number | string };
  overlay: any;
  migration: any;
  legacy: any;
}

interface StylesGlobal {
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    accent: ColorPalette;
    neutral: ColorPalette;
    semantic: { [key: string]: ColorPalette };
    surface: ColorPalette;
    text: ColorPalette;
    gradients: { [key: string]: string };
  };
  typography: Typography;
  spacing: Spacing;
  borders: Borders;
  shadows: Shadows;
  breakpoints: Breakpoints;
  animations: Animations;
  components: Components;
  utils: Utils;
}

// Convert CSS pixel values to React Native compatible units
const pixelToRN = (px: string | number): number => {
  if (typeof px === 'number') return px;
  
  const value = typeof px === 'string' ? px.trim() : String(px);
  
  // Handle rem units (1rem = 16px)
  if (value.includes('rem')) {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? 0 : numValue * 16;
  }
  
  // Handle clamp() function - use middle value as fallback
  if (value.includes('clamp(')) {
    const clampMatch = value.match(/clamp\(([^,]+),([^,]+),([^)]+)\)/);
    if (clampMatch) {
      const middleValue = clampMatch[2].trim();
      // For responsive text, use a reasonable fallback
      if (middleValue.includes('vw')) {
        return parseFloat(middleValue) * 4; // Approximation for vw
      }
      return pixelToRN(middleValue);
    }
  }
  
  // Handle regular pixel values
  const numValue = parseFloat(value);
  return isNaN(numValue) ? 0 : numValue;
};

// Convert CSS properties to React Native compatible styles
const convertStyle = (style: any): any => {
  const rnStyle: any = { ...style };

  // Convert CSS properties to React Native equivalents
  if (rnStyle.borderRadius) {
    rnStyle.borderRadius = pixelToRN(rnStyle.borderRadius);
  }
  if (rnStyle.padding) {
    rnStyle.padding = pixelToRN(rnStyle.padding);
  }
  if (rnStyle.margin) {
    rnStyle.margin = pixelToRN(rnStyle.margin);
  }
  if (rnStyle.fontSize) {
    rnStyle.fontSize = pixelToRN(rnStyle.fontSize);
  }
  if (rnStyle.lineHeight) {
    rnStyle.lineHeight = pixelToRN(rnStyle.lineHeight);
  }
  if (rnStyle.letterSpacing) {
    rnStyle.letterSpacing = pixelToRN(rnStyle.letterSpacing);
  }
  if (rnStyle.width && rnStyle.width !== '100%') {
    rnStyle.width = pixelToRN(rnStyle.width);
  }
  if (rnStyle.height && typeof rnStyle.height === 'string') {
    rnStyle.height = pixelToRN(rnStyle.height);
  }
  // gap no es soportado en RN, ignóralo
  delete rnStyle.gap;
  if (rnStyle.paddingHorizontal) {
    rnStyle.paddingHorizontal = pixelToRN(rnStyle.paddingHorizontal);
  }
  if (rnStyle.paddingVertical) {
    rnStyle.paddingVertical = pixelToRN(rnStyle.paddingVertical);
  }
  if (rnStyle.marginTop && rnStyle.marginTop !== 'auto') {
    rnStyle.marginTop = pixelToRN(rnStyle.marginTop);
  }
  if (rnStyle.marginBottom) {
    rnStyle.marginBottom = pixelToRN(rnStyle.marginBottom);
  }
  if (rnStyle.marginHorizontal && rnStyle.marginHorizontal !== 'auto') {
    rnStyle.marginHorizontal = pixelToRN(rnStyle.marginHorizontal);
  }
  if (rnStyle.maxWidth) {
    rnStyle.maxWidth = pixelToRN(rnStyle.maxWidth);
  }
  if (rnStyle.minHeight) {
    rnStyle.minHeight = pixelToRN(rnStyle.minHeight);
  }
  if (rnStyle.top && rnStyle.top !== 0) {
    rnStyle.top = pixelToRN(rnStyle.top);
  }
  if (rnStyle.right && rnStyle.right !== 0) {
    rnStyle.right = pixelToRN(rnStyle.right);
  }
  if (rnStyle.left && rnStyle.left !== 0) {
    rnStyle.left = pixelToRN(rnStyle.left);
  }
  if (rnStyle.bottom && rnStyle.bottom !== 0) {
    rnStyle.bottom = pixelToRN(rnStyle.bottom);
  }
  // Convert position fixed to absolute (React Native doesn't support fixed)
  if (rnStyle.position === 'fixed') {
    rnStyle.position = 'absolute';
  }
  // Convert fontWeight strings to numbers
  if (rnStyle.fontWeight && typeof rnStyle.fontWeight === 'string') {
    const weightMap: { [key: string]: number } = {
      '100': 100, '200': 200, '300': 300, '400': 400, '500': 500,
      '600': 600, '700': 700, '800': 800, '900': 900,
      'normal': 400, 'bold': 700
    };
    rnStyle.fontWeight = weightMap[rnStyle.fontWeight] || 400;
  }
  // Eliminar propiedades no soportadas en RN
  delete rnStyle.backdropFilter;
  delete rnStyle.transition;
  delete rnStyle.transform;
  delete rnStyle['&:hover'];
  delete rnStyle['&.active'];
  delete rnStyle['&::before'];
  delete rnStyle['@media'];
  delete rnStyle.textAlign;
  delete rnStyle.textTransform;
  // textDecorationLine sí es soportado en RN, no lo elimines
  delete rnStyle.display;
  delete rnStyle.cursor;
  delete rnStyle.outline;
  delete rnStyle.userSelect;
  delete rnStyle.boxShadow;
  delete rnStyle.flexWrap;
  // marginTop: 'auto' no es soportado
  if (rnStyle.marginTop === 'auto') {
    delete rnStyle.marginTop;
  }
  if (rnStyle.marginHorizontal === 'auto') {
    delete rnStyle.marginHorizontal;
  }
  // Gradientes: solo dejar comentario
  if (rnStyle.backgroundImage && typeof rnStyle.backgroundImage === 'string' && rnStyle.backgroundImage.includes('gradient')) {
    // Usa react-native-linear-gradient para gradientes
    delete rnStyle.backgroundImage;
  }
  return rnStyle;
};

// Global styles object
const stylesGlobal: StylesGlobal = {
  // ===============================
  // TOKENS DE DISEÑO - COLORES
  // ===============================
  colors: {
    primary: {
      50: '#fdf2f4',
      100: '#fce7eb',
      200: '#f9d0d9',
      300: '#f4a6b7',
      400: '#ed7590',
      500: '#d63384',
      600: '#c02a74',
      700: '#a02464',
      800: '#85205a',
      900: '#6f1e52',
      contrast: '#ffffff',
    },
    secondary: {
      50: '#f6f8f6',
      100: '#e8f0e8',
      200: '#d3e2d3',
      300: '#b0ccb0',
      400: '#85b085',
      500: '#6b9b6b',
      600: '#5a8a5a',
      700: '#4a734a',
      800: '#3d5e3d',
      900: '#344f34',
      contrast: '#ffffff',
    },
    accent: {
      50: '#fefcf3',
      100: '#fef7e0',
      200: '#fdecc0',
      300: '#fbdb95',
      400: '#f7c668',
      500: '#e6a756',
      600: '#d4924a',
      700: '#b17c3e',
      800: '#8f6538',
      900: '#755432',
      contrast: '#000000',
    },
    neutral: {
      0: '#ffffff',
      50: '#fafaf9',
      100: '#f7f6f4',
      200: '#ede9e6',
      300: '#ddd6d1',
      400: '#b8aca4',
      500: '#8b7d74',
      600: '#6b5d54',
      700: '#524842',
      800: '#3a332e',
      900: '#2a241f',
      950: '#1a1612',
    },
    semantic: {
      error: {
        light: '#fef2f2',
        main: '#e11d48',
        dark: '#be123c',
        contrast: '#ffffff',
      },
      warning: {
        light: '#fffbeb',
        main: '#f59e0b',
        dark: '#d97706',
        contrast: '#000000',
      },
      success: {
        light: '#f0fdf4',
        main: '#22c55e',
        dark: '#16a34a',
        contrast: '#ffffff',
      },
      info: {
        light: '#f0f9ff',
        main: '#0ea5e9',
        dark: '#0284c7',
        contrast: '#ffffff',
      },
    },
    surface: {
      primary: '#ffffff',
      secondary: '#fafaf9',
      tertiary: '#f7f6f4',
      elevated: '#ffffff',
      overlay: 'rgba(42, 36, 31, 0.75)',
      glass: 'rgba(247, 246, 244, 0.9)',
      accent: '#fefcf3',
    },
    text: {
      primary: '#2a241f',
      secondary: '#524842',
      tertiary: '#8b7d74',
      inverse: '#ffffff',
      accent: '#d63384',
      muted: '#b8aca4',
      luxury: '#e6a756',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #d63384 0%, #ed7590 100%)',
      secondary: 'linear-gradient(135deg, #6b9b6b 0%, #85b085 100%)',
      luxury: 'linear-gradient(135deg, #e6a756 0%, #f7c668 100%)',
      hero: 'linear-gradient(135deg, #fafaf9 0%, #fdf2f4 30%, #f6f8f6 60%, #fefcf3 100%)',
      warm: 'linear-gradient(to bottom, #fafaf9 0%, #f7f6f4 50%, #fefcf3 100%)',
      elegant: 'linear-gradient(135deg, #d63384 0%, #6b9b6b 50%, #e6a756 100%)',
      glass: 'linear-gradient(135deg, rgba(247, 246, 244, 0.95) 0%, rgba(254, 252, 243, 0.8) 100%)',
      sunset: 'linear-gradient(135deg, #fdf2f4 0%, #fef7e0 50%, #f6f8f6 100%)',
    },
  },

  // ===============================
  // SISTEMA TIPOGRÁFICO
  // ===============================
  typography: {
    families: {
      display: 'Playfair Display,Times New Roman,serif',
      body: 'Inter,system-ui,sans-serif',
      script: 'Dancing Script,cursive',
      mono: 'JetBrains Mono,monospace',
    },
    scale: {
      xs: 12, // 0.75rem
      sm: 14, // 0.875rem
      base: 16, // 1rem
      lg: 18, // 1.125rem
      xl: 20, // 1.25rem
      '2xl': 24, // 1.5rem
      '3xl': 30, // 1.875rem
      '4xl': 36, // 2.25rem
      '5xl': 48, // 3rem
      '6xl': 60, // 3.75rem
      '7xl': 72, // 4.5rem
      '8xl': 96, // 6rem
    },
    headings: {
      h1: {
        fontSize: 72, // clamp fallback to 4.5rem
        fontFamily: 'Playfair Display,serif',
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: -0.4,
        color: '#2a241f',
      },
      h2: {
        fontSize: 48, // clamp fallback to 3rem
        fontFamily: 'Playfair Display,serif',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.32,
        color: '#2a241f',
      },
      h3: {
        fontSize: 36, // clamp fallback to 2.25rem
        fontFamily: 'Inter,sans-serif',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: -0.16,
        color: '#524842',
      },
      h4: {
        fontSize: 30, // clamp fallback to 1.875rem
        fontFamily: 'Inter,sans-serif',
        fontWeight: 600,
        lineHeight: 1.4,
        color: '#524842',
      },
      h5: {
        fontSize: 24, // clamp fallback to 1.5rem
        fontFamily: 'Inter,sans-serif',
        fontWeight: 500,
        lineHeight: 1.4,
        color: '#524842',
      },
      h6: {
        fontSize: 20, // clamp fallback to 1.25rem
        fontFamily: 'Inter,sans-serif',
        fontWeight: 500,
        lineHeight: 1.5,
        color: '#8b7d74',
      },
    },
    body: {
      large: {
        fontSize: 18, // 1.125rem
        lineHeight: 1.7,
        fontFamily: 'Inter,sans-serif',
        color: '#524842',
      },
      base: {
        fontSize: 16, // 1rem
        lineHeight: 1.6,
        fontFamily: 'Inter,sans-serif',
        color: '#2a241f',
      },
      small: {
        fontSize: 14, // 0.875rem
        lineHeight: 1.5,
        fontFamily: 'Inter,sans-serif',
        color: '#8b7d74',
      },
      caption: {
        fontSize: 12, // 0.75rem
        lineHeight: 1.4,
        fontFamily: 'Inter,sans-serif',
        fontWeight: 500,
        color: '#b8aca4',
      },
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    leading: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    tracking: {
      tighter: -0.8, // -0.05em
      tight: -0.4, // -0.025em
      normal: 0, // 0em
      wide: 0.4, // 0.025em
      wider: 0.8, // 0.05em
      widest: 1.6, // 0.1em
    },
  },

  // ===============================
  // SISTEMA DE ESPACIADO
  // ===============================
  spacing: {
    unit: 8,
    scale: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      14: '56px',
      15: '60px',
      16: '64px',
      18: '72px',
      19: '76px',
      20: '80px',
      24: '96px',
      28: '112px',
      30: '120px',
      32: '128px',
      36: '144px',
      40: '160px',
      42: '168px',
      44: '176px',
      45: '180px',
      48: '192px',
      50: '200px',
      52: '208px',
      55: '220px',
      56: '224px',
      60: '240px',
      62: '248px',
      64: '256px',
      70: '280px',
      72: '288px',
      75: '300px',
      80: '320px',
      88: '352px',
      96: '384px',
      100: '400px',
      113: '452px',
      200: '800px',
    },
    sections: {
      xs: 32, // 2rem = 32px
      sm: 48, // 3rem = 48px
      md: 64, // 4rem = 64px
      lg: 96, // 6rem = 96px
      xl: 128, // 8rem = 128px
      xxl: 192, // 12rem = 192px
    },
    margins: {
      section: 64, // 4rem
      element: 24, // 1.5rem
    },
    gaps: {
      xs: 8, // 0.5rem
      sm: 16, // 1rem
      md: 24, // 1.5rem
      lg: 32, // 2rem
      xl: 48, // 3rem
    },
  },

  // ===============================
  // BORDES Y RADIOS
  // ===============================
  borders: {
    radius: {
      none: '0px',
      xs: '2px',
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      '3xl': '32px',
      full: '9999px',
    },
    width: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    colors: {
      default: '#ede9e6',
      muted: '#ddd6d1',
      strong: '#8b7d74',
      accent: '#d63384',
      luxury: '#e6a756',
      success: '#22c55e',
      error: '#e11d48',
      warning: '#f59e0b',
    },
  },

  // ===============================
  // SISTEMA DE SOMBRAS
  // ===============================
  shadows: {
    none: 'none',
    xs: {
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    sm: {
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    base: {
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    md: {
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    lg: {
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    xl: {
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 50,
    },
    '2xl': {
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.25,
      shadowRadius: 100,
    },
    brand: {
      primary: {
        shadowColor: '#d63384',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 32,
      },
      secondary: {
        shadowColor: '#6b9b6b',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 32,
      },
      luxury: {
        shadowColor: '#e6a756',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 32,
      },
      glow: {
        shadowColor: '#d63384',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
      },
      elegant: {
        shadowColor: '#d63384',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 40,
      },
    },
    inner: 'none', // Inner shadows not supported in React Native
  },

  // ===============================
  // BREAKPOINTS RESPONSIVOS
  // ===============================
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ===============================
  // SISTEMA DE ANIMACIONES
  // ===============================
  animations: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
      slowest: '1000ms',
      elegant: '400ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elegant: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    transitions: {
      base: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
      fast: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
      slow: 'all 300ms cubic-bezier(0, 0, 0.2, 1)',
      elegant: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      colors: 'color 200ms cubic-bezier(0, 0, 0.2, 1), background-color 200ms cubic-bezier(0, 0, 0.2, 1)',
      opacity: 'opacity 200ms cubic-bezier(0, 0, 0.2, 1)',
      transform: 'transform 200ms cubic-bezier(0, 0, 0.2, 1)',
    },
  },

  // ===============================
  // COMPONENTES BASE
  // ===============================
  components: {
    navbar: {
      base: convertStyle({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: pixelToRN('72px'),
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottomWidth: 1,
        borderBottomColor: '#ede9e6',
        shadowColor: '#2a241f',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        zIndex: 1100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pixelToRN('2rem'),
      }),
      variants: {
        transparent: convertStyle({
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
          shadowOpacity: 0,
        }),
        solid: convertStyle({
          backgroundColor: '#ffffff',
        }),
        luxury: convertStyle({
          backgroundColor: '#ffffff', // Gradients not supported, using solid color
          borderBottomWidth: 1,
          borderBottomColor: '#e6a756',
          shadowColor: '#e6a756',
          shadowOpacity: 0.1,
        }),
        dark: convertStyle({
          backgroundColor: 'rgba(42, 36, 31, 0.95)',
          borderBottomWidth: 1,
          borderBottomColor: '#524842',
          color: '#ffffff',
        }),
      },
      scrolled: convertStyle({
        height: pixelToRN('64px'),
        shadowColor: '#2a241f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: '#ffffff',
      }),
      brand: convertStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: pixelToRN('12px'),
        fontFamily: 'Playfair Display,serif',
        fontSize: pixelToRN('1.5rem'),
        fontWeight: '700',
        color: '#d63384',
        textDecorationLine: 'none',
      }),
      nav: convertStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: pixelToRN('2rem'),
      }),
      navItem: convertStyle({
        position: 'relative',
      }),
      navLink: convertStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: pixelToRN('8px'),
        paddingVertical: pixelToRN('8px'),
        paddingHorizontal: pixelToRN('16px'),
        fontSize: pixelToRN('1rem'),
        fontWeight: '500',
        color: '#524842',
        textDecorationLine: 'none',
        borderRadius: pixelToRN('10px'),
      }),
      actions: convertStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: pixelToRN('1rem'),
      }),
      mobile: convertStyle({
        paddingHorizontal: pixelToRN('1rem'),
        height: pixelToRN('60px'),
      }),
      mobileMenu: convertStyle({
        position: 'fixed',
        top: pixelToRN('72px'),
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderBottomWidth: 1,
        borderBottomColor: '#ede9e6',
        shadowColor: '#2a241f',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        padding: pixelToRN('1rem'),
        zIndex: 1050,
      }),
      hamburger: convertStyle({
        display: 'none',
        flexDirection: 'column',
        gap: pixelToRN('4px'),
        width: pixelToRN('24px'),
        height: pixelToRN('18px'),
      }),
      hamburgerLine: convertStyle({
        width: '100%',
        height: pixelToRN('2px'),
        backgroundColor: '#524842',
        borderRadius: pixelToRN('2px'),
      }),
    },
    sidebar: {
      base: convertStyle({
        position: 'fixed',
        top: 0,
        left: 0,
        width: pixelToRN('280px'),
        height,
        backgroundColor: '#ffffff',
        borderRightWidth: 1,
        borderRightColor: '#ede9e6',
        shadowColor: '#2a241f',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        zIndex: 1000,
        flexDirection: 'column',
      }),
      variants: {
        luxury: convertStyle({
          backgroundColor: '#ffffff', // Gradients not supported
          borderRightWidth: 1,
          borderRightColor: '#e6a756',
        }),
        dark: convertStyle({
          backgroundColor: '#2a241f',
          borderRightWidth: 1,
          borderRightColor: '#524842',
          color: '#ffffff',
        }),
        glass: convertStyle({
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }),
        minimal: convertStyle({
          width: pixelToRN('64px'),
          borderRightWidth: 1,
          borderRightColor: '#ede9e6',
        }),
      },
      collapsed: convertStyle({
        width: pixelToRN('64px'),
      }),
      header: convertStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: pixelToRN('12px'),
        padding: pixelToRN('1.5rem'),
        borderBottomWidth: 1,
        borderBottomColor: '#ede9e6',
        minHeight: pixelToRN('72px'),
      }),
      logo: convertStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: pixelToRN('12px'),
        textDecorationLine: 'none',
      }),
      logoIcon: convertStyle({
        width: pixelToRN('32px'),
        height: pixelToRN('32px'),
        borderRadius: pixelToRN('8px'),
        backgroundColor: '#d63384',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: pixelToRN('1.2rem'),
        fontWeight: '700',
      }),
      logoText: convertStyle({
        fontFamily: 'Playfair Display,serif',
        fontSize: pixelToRN('1.25rem'),
        fontWeight: '700',
        color: '#2a241f',
      }),
      content: convertStyle({
        flex: 1,
        padding: pixelToRN('1rem'),
      }),
      nav: convertStyle({
        flexDirection: 'column',
        gap: pixelToRN('4px'),
      }),
      navItem: convertStyle({
        position: 'relative',
      }),
      navLink: convertStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: pixelToRN('12px'),
        paddingVertical: pixelToRN('12px'),
        paddingHorizontal: pixelToRN('16px'),
        fontSize: pixelToRN('0.95rem'),
        fontWeight: '500',
        color: '#524842',
        textDecorationLine: 'none',
        borderRadius: pixelToRN('10px'),
      }),
      navIcon: convertStyle({
        width: pixelToRN('20px'),
        height: pixelToRN('20px'),
        alignItems: 'center',
        justifyContent: 'center',
      }),
      navText: convertStyle({
      }),
      section: convertStyle({
        marginTop: pixelToRN('2rem'),
      }),
      sectionTitle: convertStyle({
        fontSize: pixelToRN('0.75rem'),
        fontWeight: '600',
        color: '#8b7d74',
        textTransform: 'uppercase',
        letterSpacing: pixelToRN('0.05em'),
        paddingVertical: pixelToRN('8px'),
        paddingHorizontal: pixelToRN('16px'),
        marginBottom: pixelToRN('8px'),
      }),
      footer: convertStyle({
        padding: pixelToRN('1rem'),
        paddingHorizontal: pixelToRN('1.5rem'),
        borderTopWidth: 1,
        borderTopColor: '#ede9e6',
        marginTop: 'auto',
      }),
      toggle: convertStyle({
        position: 'absolute',
        top: '50%',
        right: pixelToRN('-12px'),
        width: pixelToRN('24px'),
        height: pixelToRN('24px'),
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ede9e6',
        borderRadius: pixelToRN('50%'),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2a241f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }),
      mobile: convertStyle({
      }),
      overlay: convertStyle({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(42, 36, 31, 0.5)',
        zIndex: 999,
      }),
    },
    footer: {
      base: convertStyle({
        backgroundColor: '#2a241f',
        color: '#ffffff',
        marginTop: 'auto',
      }),
      variants: {
        simple: convertStyle({
          paddingVertical: pixelToRN('2rem'),
          textAlign: 'center',
          borderTopWidth: 1,
          borderTopColor: '#524842',
        }),
        complex: convertStyle({
          paddingVertical: pixelToRN('4rem'),
          paddingBottom: pixelToRN('2rem'),
        }),
        luxury: convertStyle({
          backgroundColor: '#2a241f', // Gradients not supported
          borderTopWidth: 1,
          borderTopColor: '#e6a756',
        }),
        minimal: convertStyle({
          backgroundColor: '#fafaf9',
          color: '#524842',
          borderTopWidth: 1,
          borderTopColor: '#ede9e6',
          paddingVertical: pixelToRN('1.5rem'),
        }),
      },
      main: convertStyle({
        paddingVertical: pixelToRN('4rem'),
        paddingBottom: pixelToRN('2rem'),
      }),
      grid: convertStyle({
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: pixelToRN('2rem'),
        maxWidth: pixelToRN('1200px'),
        marginHorizontal: 'auto',
        paddingHorizontal: pixelToRN('2rem'),
      }),
      section: convertStyle({
        flexDirection: 'column',
        gap: pixelToRN('1rem'),
      }),
      brand: convertStyle({
        flexDirection: 'column',
        gap: pixelToRN('1rem'),
        maxWidth: pixelToRN('300px'),
      }),
      logo: convertStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: pixelToRN('12px'),
        marginBottom: pixelToRN('1rem'),
      }),
      logoIcon: convertStyle({
        width: pixelToRN('40px'),
        height: pixelToRN('40px'),
        borderRadius: pixelToRN('10px'),
        backgroundColor: '#d63384',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: pixelToRN('1.5rem'),
        fontWeight: '700',
      }),
      logoText: convertStyle({
        fontFamily: 'Playfair Display,serif',
        fontSize: pixelToRN('1.5rem'),
        fontWeight: '700',
        color: '#ffffff',
      }),
      description: convertStyle({
        fontSize: pixelToRN('0.95rem'),
        lineHeight: 1.6,
        color: '#b8aca4',
      }),
      title: convertStyle({
        fontSize: pixelToRN('1.125rem'),
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: pixelToRN('1rem'),
      }),
      nav: convertStyle({
        flexDirection: 'column',
        gap: pixelToRN('8px'),
      }),
      navLink: convertStyle({
        color: '#b8aca4',
        textDecorationLine: 'none',
        fontSize: pixelToRN('0.95rem'),
      }),
      contact: convertStyle({
        flexDirection: 'column',
        gap: pixelToRN('12px'),
      }),
      contactItem: convertStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: pixelToRN('12px'),
        color: '#b8aca4',
        fontSize: pixelToRN('0.95rem'),
      }),
      contactIcon: convertStyle({
        width: pixelToRN('20px'),
        height: pixelToRN('20px'),
        color: '#d63384',
      }),
      social: convertStyle({
        flexDirection: 'row',
        gap: pixelToRN('1rem'),
        marginTop: pixelToRN('1rem'),
      }),
      socialLink: convertStyle({
        alignItems: 'center',
        justifyContent: 'center',
        width: pixelToRN('40px'),
        height: pixelToRN('40px'),
        backgroundColor: '#524842',
        color: '#ffffff',
        borderRadius: pixelToRN('10px'),
        textDecorationLine: 'none',
      }),
      newsletter: convertStyle({
        flexDirection: 'column',
        gap: pixelToRN('1rem'),
        maxWidth: pixelToRN('300px'),
      }),
      newsletterForm: convertStyle({
        flexDirection: 'row',
        gap: pixelToRN('8px'),
      }),
      newsletterInput: convertStyle({
        flex: 1,
        paddingVertical: pixelToRN('10px'),
        paddingHorizontal: pixelToRN('14px'),
        fontSize: pixelToRN('0.95rem'),
        backgroundColor: '#524842',
        borderWidth: 1,
        borderColor: '#6b5d54',
        borderRadius: pixelToRN('8px'),
        color: '#ffffff',
      }),
      newsletterButton: convertStyle({
        paddingVertical: pixelToRN('10px'),
        paddingHorizontal: pixelToRN('16px'),
        backgroundColor: '#d63384',
        color: '#ffffff',
        borderWidth: 0,
        borderRadius: pixelToRN('8px'),
        fontSize: pixelToRN('0.95rem'),
        fontWeight: '500',
      }),
      bottom: convertStyle({
        borderTopWidth: 1,
        borderTopColor: '#524842',
        paddingVertical: pixelToRN('1.5rem'),
        marginTop: pixelToRN('2rem'),
      }),
      bottomContent: convertStyle({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: pixelToRN('1200px'),
        marginHorizontal: 'auto',
        paddingHorizontal: pixelToRN('2rem'),
        gap: pixelToRN('1rem'),
      }),
      copyright: convertStyle({
        fontSize: pixelToRN('0.875rem'),
        color: '#8b7d74',
      }),
      bottomNav: convertStyle({
        flexDirection: 'row',
        gap: pixelToRN('2rem'),
      }),
      bottomNavLink: convertStyle({
        color: '#8b7d74',
        textDecorationLine: 'none',
        fontSize: pixelToRN('0.875rem'),
      }),
      mobile: convertStyle({
        paddingVertical: pixelToRN('2rem'),
        paddingBottom: pixelToRN('1rem'),
      }),
    },
    button: {
      sizes: {
        xs: convertStyle({
          paddingVertical: pixelToRN('6px'),
          paddingHorizontal: pixelToRN('12px'),
          fontSize: pixelToRN('0.75rem'),
          borderRadius: pixelToRN('6px'),
        }),
        sm: convertStyle({
          paddingVertical: pixelToRN('8px'),
          paddingHorizontal: pixelToRN('16px'),
          fontSize: pixelToRN('0.875rem'),
          borderRadius: pixelToRN('8px'),
        }),
        base: convertStyle({
          paddingVertical: pixelToRN('12px'),
          paddingHorizontal: pixelToRN('24px'),
          fontSize: pixelToRN('1rem'),
          borderRadius: pixelToRN('10px'),
        }),
        lg: convertStyle({
          paddingVertical: pixelToRN('16px'),
          paddingHorizontal: pixelToRN('32px'),
          fontSize: pixelToRN('1.125rem'),
          borderRadius: pixelToRN('12px'),
        }),
        xl: convertStyle({
          paddingVertical: pixelToRN('20px'),
          paddingHorizontal: pixelToRN('40px'),
          fontSize: pixelToRN('1.25rem'),
          borderRadius: pixelToRN('16px'),
        }),
      },
      variants: {
        primary: convertStyle({
          backgroundColor: '#d63384',
          color: '#ffffff',
          borderWidth: 1,
          borderColor: '#d63384',
          shadowColor: '#d63384',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 32,
        }),
        secondary: convertStyle({
          backgroundColor: 'transparent',
          color: '#6b9b6b',
          borderWidth: 1,
          borderColor: '#6b9b6b',
        }),
        luxury: convertStyle({
          backgroundColor: '#e6a756',
          color: '#2a241f',
          borderWidth: 1,
          borderColor: '#e6a756',
          shadowColor: '#e6a756',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 32,
        }),
        ghost: convertStyle({
          backgroundColor: 'transparent',
          color: '#524842',
          borderWidth: 1,
          borderColor: 'transparent',
        }),
      },
    },
    card: {
      base: convertStyle({
        backgroundColor: '#ffffff',
        borderRadius: pixelToRN('16px'),
        borderWidth: 1,
        borderColor: '#ede9e6',
        shadowColor: '#2a241f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }),
      elevated: convertStyle({
        shadowColor: '#2a241f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }),
      luxury: convertStyle({
        backgroundColor: '#ffffff', // Gradients not supported
        borderWidth: 1,
        borderColor: '#e6a756',
        shadowColor: '#e6a756',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 32,
      }),
      interactive: convertStyle({
      }),
    },
    input: {
      base: convertStyle({
        width: '100%',
        paddingVertical: pixelToRN('12px'),
        paddingHorizontal: pixelToRN('16px'),
        fontSize: pixelToRN('1rem'),
        lineHeight: 1.5,
        color: '#2a241f',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd6d1',
        borderRadius: pixelToRN('10px'),
      }),
      luxury: convertStyle({
        borderWidth: 1,
        borderColor: '#e6a756',
      }),
      error: convertStyle({
        borderColor: '#e11d48',
      }),
    },
    cssGlobals: {
      // Animations not supported in React Native, included for reference
      fadeInUp: '',
      videoCarousel: '',
      playOverlay: '',
      lightbox: '',
    },
  },

  // ===============================
  // UTILIDADES Y HELPERS
  // ===============================
  utils: {
    container: {
      center: true,
      padding: pixelToRN('1rem'),
      maxWidth: {
        sm: pixelToRN('640px'),
        md: pixelToRN('768px'),
        lg: pixelToRN('1024px'),
        xl: pixelToRN('1280px'),
        '2xl': pixelToRN('1400px'),
      },
    },
    zIndex: {
      hide: -1,
      auto: 'auto',
      base: 0,
      docked: 10,
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skipLink: 1600,
      toast: 1700,
      tooltip: 1800,
    },
    overlay: {
      base: convertStyle({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(42, 36, 31, 0.75)',
        zIndex: 1300,
      }),
      elegant: convertStyle({
        backgroundColor: 'rgba(42, 36, 31, 0.8)', // Gradients not supported
      }),
      blur: convertStyle({
      }),
    },
    migration: {
      colorMapping: {
        '#0D1B2A': '#2a241f',
        '#1B263B': '#524842',
        '#3498db': '#6b9b6b',
        '#2c3e50': '#8b7d74',
        '#090E15': '#1a1612',
        '#233044': '#3a332e',
        '#FFFFFF': '#ffffff',
        '#F8F9FA': '#fafaf9',
        '#F5F6F8': '#f7f6f4',
        '#E2E8F0': '#ede9e6',
        '#F1F5F9': '#ddd6d1',
        '#64748B': '#b8aca4',
      },
      componentMapping: {
        oldNavbarAdmin: 'stylesGlobal.components.navbar.variants.dark',
        oldNavbarColors: 'stylesGlobal.colors.surface.elevated',
        oldSidebarAdmin: 'stylesGlobal.components.sidebar.variants.dark',
        oldSidebarColors: 'stylesGlobal.colors.neutral[900]',
        oldFooter: 'stylesGlobal.components.footer.variants.luxury',
        oldFooterColors: 'stylesGlobal.colors.neutral[900]',
        oldNavbarBase: 'stylesGlobal.components.navbar.base',
        oldNavbarPublic: 'stylesGlobal.components.navbar.variants.solid',
      },
      transitionGuide: {
        step1: 'Reemplazar imports de colors antiguos con stylesGlobal',
        step2: 'Migrar estilos inline a sistema de componentes global',
        step3: 'Actualizar animaciones a cubic-bezier elegante',
        step4: 'Implementar variantes glass y luxury donde corresponda',
        step5: 'Unificar sistema de espaciado con spacing.scale',
      },
    },
    legacy: {
      getOldColor: (oldColor: string): string => {
        const mapping: { [key: string]: string } = {
          '#0D1B2A': stylesGlobal.colors.neutral[900] as string,
          '#1B263B': stylesGlobal.colors.neutral[700] as string,
          '#3498db': stylesGlobal.colors.secondary[500] as string,
        };
        return mapping[oldColor] || oldColor;
      },
      convertStyle: (oldStyleObject: any): any => {
        const newStyle = { ...oldStyleObject };
        Object.keys(newStyle).forEach((key) => {
          if (typeof newStyle[key] === 'string' && newStyle[key].startsWith('#')) {
            const newColor = stylesGlobal.utils.legacy.getOldColor(newStyle[key]);
            if (newColor !== newStyle[key]) {
              newStyle[key] = newColor;
            }
          }
        });
        return newStyle; // Removed circular reference
      },
    },
  },
};

// Create React Native StyleSheet
const globalStyles = StyleSheet.create({
  // Flatten styles for React Native components
  navbarBase: stylesGlobal.components.navbar.base,
  navbarTransparent: stylesGlobal.components.navbar.variants.transparent,
  navbarSolid: stylesGlobal.components.navbar.variants.solid,
  navbarLuxury: stylesGlobal.components.navbar.variants.luxury,
  navbarDark: stylesGlobal.components.navbar.variants.dark,
  navbarScrolled: stylesGlobal.components.navbar.scrolled,
  navbarBrand: stylesGlobal.components.navbar.brand,
  navbarNav: stylesGlobal.components.navbar.nav,
  navbarNavItem: stylesGlobal.components.navbar.navItem,
  navbarNavLink: stylesGlobal.components.navbar.navLink,
  navbarActions: stylesGlobal.components.navbar.actions,
  navbarMobile: stylesGlobal.components.navbar.mobile,
  navbarMobileMenu: stylesGlobal.components.navbar.mobileMenu,
  navbarHamburger: stylesGlobal.components.navbar.hamburger,
  navbarHamburgerLine: stylesGlobal.components.navbar.hamburgerLine,

  sidebarBase: stylesGlobal.components.sidebar.base,
  sidebarLuxury: stylesGlobal.components.sidebar.variants.luxury,
  sidebarDark: stylesGlobal.components.sidebar.variants.dark,
  sidebarGlass: stylesGlobal.components.sidebar.variants.glass,
  sidebarMinimal: stylesGlobal.components.sidebar.variants.minimal,
  sidebarCollapsed: stylesGlobal.components.sidebar.collapsed,
  sidebarHeader: stylesGlobal.components.sidebar.header,
  sidebarLogo: stylesGlobal.components.sidebar.logo,
  sidebarLogoIcon: stylesGlobal.components.sidebar.logoIcon,
  sidebarLogoText: stylesGlobal.components.sidebar.logoText,
  sidebarContent: stylesGlobal.components.sidebar.content,
  sidebarNav: stylesGlobal.components.sidebar.nav,
  sidebarNavItem: stylesGlobal.components.sidebar.navItem,
  sidebarNavLink: stylesGlobal.components.sidebar.navLink,
  sidebarNavIcon: stylesGlobal.components.sidebar.navIcon,
  sidebarNavText: stylesGlobal.components.sidebar.navText,
  sidebarSection: stylesGlobal.components.sidebar.section,
  sidebarSectionTitle: stylesGlobal.components.sidebar.sectionTitle,
  sidebarFooter: stylesGlobal.components.sidebar.footer,
  sidebarToggle: stylesGlobal.components.sidebar.toggle,
  sidebarOverlay: stylesGlobal.components.sidebar.overlay,

  footerBase: stylesGlobal.components.footer.base,
  footerSimple: stylesGlobal.components.footer.variants.simple,
  footerComplex: stylesGlobal.components.footer.variants.complex,
  footerLuxury: stylesGlobal.components.footer.variants.luxury,
  footerMinimal: stylesGlobal.components.footer.variants.minimal,
  footerMain: stylesGlobal.components.footer.main,
  footerGrid: stylesGlobal.components.footer.grid,
  footerSection: stylesGlobal.components.footer.section,
  footerBrand: stylesGlobal.components.footer.brand,
  footerLogo: stylesGlobal.components.footer.logo,
  footerLogoIcon: stylesGlobal.components.footer.logoIcon,
  footerLogoText: stylesGlobal.components.footer.logoText,
  footerDescription: stylesGlobal.components.footer.description,
  footerTitle: stylesGlobal.components.footer.title,
  footerNav: stylesGlobal.components.footer.nav,
  footerNavLink: stylesGlobal.components.footer.navLink,
  footerContact: stylesGlobal.components.footer.contact,
  footerContactItem: stylesGlobal.components.footer.contactItem,
  footerContactIcon: stylesGlobal.components.footer.contactIcon,
  footerSocial: stylesGlobal.components.footer.social,
  footerSocialLink: stylesGlobal.components.footer.socialLink,
  footerNewsletter: stylesGlobal.components.footer.newsletter,
  footerNewsletterForm: stylesGlobal.components.footer.newsletterForm,
  footerNewsletterInput: stylesGlobal.components.footer.newsletterInput,
  footerNewsletterButton: stylesGlobal.components.footer.newsletterButton,
  footerBottom: stylesGlobal.components.footer.bottom,
  footerBottomContent: stylesGlobal.components.footer.bottomContent,
  footerCopyright: stylesGlobal.components.footer.copyright,
  footerBottomNav: stylesGlobal.components.footer.bottomNav,
  footerBottomNavLink: stylesGlobal.components.footer.bottomNavLink,
  footerMobile: stylesGlobal.components.footer.mobile,

  buttonXs: stylesGlobal.components.button.sizes.xs,
  buttonSm: stylesGlobal.components.button.sizes.sm,
  buttonBase: stylesGlobal.components.button.sizes.base,
  buttonLg: stylesGlobal.components.button.sizes.lg,
  buttonXl: stylesGlobal.components.button.sizes.xl,
  buttonPrimary: stylesGlobal.components.button.variants.primary,
  buttonSecondary: stylesGlobal.components.button.variants.secondary,
  buttonLuxury: stylesGlobal.components.button.variants.luxury,
  buttonGhost: stylesGlobal.components.button.variants.ghost,

  cardBase: stylesGlobal.components.card.base,
  cardElevated: stylesGlobal.components.card.elevated,
  cardLuxury: stylesGlobal.components.card.luxury,
  cardInteractive: stylesGlobal.components.card.interactive,

  inputBase: stylesGlobal.components.input.base,
  inputLuxury: stylesGlobal.components.input.luxury,
  inputError: stylesGlobal.components.input.error,
});

export { globalStyles, stylesGlobal };

