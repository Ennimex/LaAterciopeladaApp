import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/ui/AppText';
import { useAuth } from '../context/AuthProvider';
import { stylesGlobal } from '../styles/stylesGlobal';

// El panel de administración completo vive en el sitio web (HashRouter → /#/admin)
const ADMIN_WEB_URL = 'https://fron-gamma.vercel.app/#/admin';

const primary = stylesGlobal.colors.primary[500] as string;
const textPrimary = stylesGlobal.colors.text.primary as string;
const surface = stylesGlobal.colors.surface.primary as string;
const border = '#ede9e6';
const bg = '#faf6ee';

const FUNCIONES_WEB = [
  { icon: 'pricetags-outline', label: 'Gestión de productos, tallas y categorías' },
  { icon: 'sparkles-outline', label: 'Gestión de servicios y localidades' },
  { icon: 'images-outline', label: 'Galería: fotos, videos y eventos' },
  { icon: 'people-outline', label: 'Usuarios y colaboradores' },
  { icon: 'document-text-outline', label: 'Solicitudes de cotización' },
] as const;

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Solo para administradores: cualquier otro usuario vuelve a las tabs
  useEffect(() => {
    if (!user || user.role !== 'admin') router.replace('/(tabs)');
  }, [user, router]);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={{ padding: 4 }} accessibilityLabel="Regresar">
          <Ionicons name="arrow-back" size={24} color={primary} />
        </TouchableOpacity>
        <AppText variant="h1" style={{ fontSize: 24 }}>
          Administración
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={40} color={primary} />
        </View>

        <AppText variant="h2" style={styles.title}>
          Hola{user?.name ? `, ${user.name}` : ''} 👋
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          Esta app está pensada para tus clientes. Para ver más detalles y todas las funciones de
          administración, consulta el sitio web.
        </AppText>

        <View style={styles.card}>
          <AppText variant="eyebrow" style={{ marginBottom: 12 }}>
            Disponible en el sitio web
          </AppText>
          {FUNCIONES_WEB.map((f, i) => (
            <View
              key={f.label}
              style={[styles.featureRow, i < FUNCIONES_WEB.length - 1 && styles.featureDivider]}
            >
              <Ionicons name={f.icon} size={20} color={primary} />
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => Linking.openURL(ADMIN_WEB_URL)}
          accessibilityRole="button"
          accessibilityLabel="Abrir panel de administración en el sitio web"
        >
          <Ionicons name="open-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Abrir panel web</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace('/(tabs)')}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryBtnText}>Seguir explorando la app</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#fdf0f6',
    borderWidth: 1,
    borderColor: '#f5d3e4',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: border,
    padding: 16,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  featureDivider: {
    borderBottomWidth: 1,
    borderBottomColor: border,
  },
  featureLabel: {
    flex: 1,
    fontSize: 14,
    color: textPrimary,
  },
  primaryBtn: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: primary,
    paddingVertical: 13,
  },
  secondaryBtnText: {
    color: primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
