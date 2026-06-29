import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthProvider';
import { FavoritosProvider } from '../context/FavoritosContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Fuentes de marca (coinciden con la web: Playfair Display + Inter)
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <FavoritosProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="PerfilScreen" options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
            <Stack.Screen name="RegisterScreen" options={{ headerShown: false }} />
            <Stack.Screen name="MisFavoritos" options={{ headerShown: false }} />
            <Stack.Screen name="MisSolicitudes" options={{ headerShown: false }} />
            <Stack.Screen name="Nosotros" options={{ headerShown: false }} />
            <Stack.Screen name="Contacto" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </FavoritosProvider>
    </AuthProvider>
  );
}