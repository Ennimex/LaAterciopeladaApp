import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { stylesGlobal } from '../styles/stylesGlobal';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Siempre va al Home, el login es opcional desde el Home
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={splashStyles.container}>
      <Image
        source={require('../assets/images/logo-aterciopelada.png')}
        style={splashStyles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={stylesGlobal.colors.primary[500] as string} />
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: typeof stylesGlobal.colors.surface.primary === 'string'
      ? stylesGlobal.colors.surface.primary
      : '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
    borderRadius: 100,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: stylesGlobal.colors.primary[500] as string,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});