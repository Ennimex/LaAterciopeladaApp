import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthProvider';
import { AppText } from './AppText';

const PRIMARY = '#d63384';
const ERROR = '#e11d48';
const BG = '#faf6ee';
const TEXT_DARK = '#2a241f';
const TEXT_MUTED = '#8b7d74';
const BORDER = '#ede9e6';

const { width: SCREEN_W } = Dimensions.get('window');
const PANEL_W = Math.min(320, SCREEN_W * 0.82);

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function Row({ label, icon, onPress, danger }: { label: string; icon: IconName; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 20 }}>
      <Ionicons name={icon} size={22} color={danger ? ERROR : PRIMARY} />
      <Text style={{ fontSize: 15, fontWeight: '600', color: danger ? ERROR : TEXT_DARK }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function DrawerMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout } = useAuth();
  const slide = useRef(new Animated.Value(-PANEL_W)).current;

  useEffect(() => {
    Animated.timing(slide, { toValue: visible ? 0 : -PANEL_W, duration: 220, useNativeDriver: true }).start();
  }, [visible, slide]);

  const go = (route: string) => {
    onClose();
    setTimeout(() => router.push(route as any), 160);
  };

  const navegar: { label: string; icon: IconName; route: string }[] = [
    { label: 'Inicio', icon: 'home-outline', route: '/(tabs)' },
    { label: 'Productos', icon: 'pricetags-outline', route: '/(tabs)/ProductosScreen' },
    { label: 'Servicios', icon: 'sparkles-outline', route: '/(tabs)/ServiciosScreen' },
    { label: 'Galería', icon: 'images-outline', route: '/(tabs)/GaleriaScreen' },
    { label: 'Nosotros', icon: 'people-outline', route: '/Nosotros' },
    { label: 'Contacto', icon: 'mail-outline', route: '/Contacto' },
  ];

  const cuenta: { label: string; icon: IconName; route: string }[] = isAuthenticated
    ? [
        { label: 'Mi Perfil', icon: 'person-outline', route: '/PerfilScreen' },
        { label: 'Mis Favoritos', icon: 'heart-outline', route: '/MisFavoritos' },
        { label: 'Mis Solicitudes', icon: 'document-text-outline', route: '/MisSolicitudes' },
      ]
    : [
        { label: 'Iniciar sesión', icon: 'log-in-outline', route: '/LoginScreen' },
        { label: 'Registrarse', icon: 'person-add-outline', route: '/RegisterScreen' },
      ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <Pressable
          onPress={onClose}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(42,36,31,0.5)' }}
        />

        {/* Panel */}
        <Animated.View
          style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: PANEL_W,
            backgroundColor: BG, transform: [{ translateX: slide }], paddingTop: insets.top + 8,
            shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 16,
          }}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={require('../../assets/images/logo-aterciopelada.png')} style={{ width: 44, height: 44, borderRadius: 22 }} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <AppText variant="h2" style={{ fontSize: 18 }}>La Aterciopelada</AppText>
              <Text style={{ fontSize: 12, color: TEXT_MUTED }} numberOfLines={1}>
                {isAuthenticated ? (user?.name || user?.email || 'Mi cuenta') : 'Invitado'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Ionicons name="close" size={24} color={TEXT_MUTED} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingVertical: 12 }} showsVerticalScrollIndicator={false}>
            {navegar.map((it) => <Row key={it.label} label={it.label} icon={it.icon} onPress={() => go(it.route)} />)}

            <View style={{ height: 1, backgroundColor: BORDER, marginVertical: 8, marginHorizontal: 20 }} />

            {cuenta.map((it) => <Row key={it.label} label={it.label} icon={it.icon} onPress={() => go(it.route)} />)}

            {isAuthenticated && (
              <Row
                label="Cerrar sesión"
                icon="log-out-outline"
                danger
                onPress={() => { onClose(); logout(); router.replace('/(tabs)'); }}
              />
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default DrawerMenu;
