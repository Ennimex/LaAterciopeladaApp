import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import { useAuth } from '../../context/AuthProvider';
import { stylesGlobal } from '../../styles/stylesGlobal';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const primary = stylesGlobal.colors.primary[500] as string;
const errorColor = stylesGlobal.colors.semantic.error.main as string;
const textPrimary = stylesGlobal.colors.text.primary as string;
const textMuted = stylesGlobal.colors.text.muted as string;
const surface = stylesGlobal.colors.surface.primary as string;
const border = '#ede9e6';
const bg = '#faf6ee';

function Row({
  label,
  icon,
  onPress,
  danger,
  isLast,
}: {
  label: string;
  icon: IconName;
  onPress: () => void;
  danger?: boolean;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: border }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.rowIcon, danger && { backgroundColor: '#fdeef1' }]}>
        <Ionicons name={icon} size={20} color={danger ? errorColor : primary} />
      </View>
      <Text style={[styles.rowLabel, danger && { color: errorColor }]}>{label}</Text>
      {!danger && <Ionicons name="chevron-forward" size={18} color={textMuted} />}
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="eyebrow" style={styles.sectionTitle}>
        {title}
      </AppText>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export default function MasScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const go = (route: string) => router.push(route as any);
  // Vistas que requieren sesión: sin sesión se va directo a Login (sin alertas)
  const goAuth = (route: string) => go(isAuthenticated ? route : '/LoginScreen');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cabecera: logo + saludo */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo-aterciopelada.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <AppText variant="h2" style={{ fontSize: 20 }}>
              La Aterciopelada
            </AppText>
            <Text style={styles.greeting} numberOfLines={1}>
              {isAuthenticated ? `Hola, ${user?.name || user?.email || 'bienvenido/a'}` : 'Invitado'}
            </Text>
          </View>
        </View>

        {/* Invitado: acceso destacado a la cuenta */}
        {!isAuthenticated && (
          <View style={styles.authBox}>
            <Text style={styles.authText}>
              Inicia sesión para guardar favoritos y solicitar cotizaciones.
            </Text>
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={[styles.authBtn, { backgroundColor: primary }]}
                onPress={() => go('/LoginScreen')}
              >
                <Text style={styles.authBtnText}>Iniciar sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authBtn, styles.authBtnOutline]}
                onPress={() => go('/RegisterScreen')}
              >
                <Text style={[styles.authBtnText, { color: primary }]}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Section title="Conócenos">
          <Row label="Nosotros" icon="people-outline" onPress={() => go('/Nosotros')} />
          <Row label="Contacto" icon="mail-outline" onPress={() => go('/Contacto')} isLast />
        </Section>

        {/* Siempre visible: sin sesión, cada opción lleva directo a Login */}
        <Section title="Mi cuenta">
          <Row label="Mi Perfil" icon="person-outline" onPress={() => goAuth('/PerfilScreen')} />
          <Row label="Mis Favoritos" icon="heart-outline" onPress={() => goAuth('/MisFavoritos')} />
          <Row
            label="Mis Solicitudes"
            icon="document-text-outline"
            onPress={() => goAuth('/MisSolicitudes')}
            isLast
          />
        </Section>

        {isAdmin && (
          <Section title="Administración">
            <Row
              label="Panel de administración"
              icon="shield-checkmark-outline"
              onPress={() => go('/AdminScreen')}
              isLast
            />
          </Section>
        )}

        {isAuthenticated && (
          <Section title="Sesión">
            <Row
              label="Cerrar sesión"
              icon="log-out-outline"
              danger
              isLast
              onPress={() => {
                logout();
                router.replace('/(tabs)');
              }}
            />
          </Section>
        )}

        <Text style={styles.footer}>La Aterciopelada · Versión 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  greeting: {
    fontSize: 13,
    color: textMuted,
    marginTop: 2,
  },
  authBox: {
    backgroundColor: surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: border,
    padding: 16,
    marginBottom: 20,
  },
  authText: {
    fontSize: 14,
    color: textPrimary,
    marginBottom: 12,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  authBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  authBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: primary,
  },
  authBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fdf0f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: textPrimary,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: textMuted,
    marginTop: 8,
  },
});
