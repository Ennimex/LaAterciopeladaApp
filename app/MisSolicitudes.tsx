import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/ui/AppText';
import { useAuth } from '../context/AuthProvider';
import solicitudService from '../services/solicitudService';

const PRIMARY = '#d63384';
const BG = '#faf6ee';
const SURFACE = '#ffffff';
const TEXT_DARK = '#2a241f';
const TEXT_MUTED = '#8b7d74';
const BORDER = '#ede9e6';

const ESTADOS: Record<string, { label: string; bg: string; color: string }> = {
  pendiente: { label: 'Pendiente', bg: '#fef7e0', color: '#b17c3e' },
  atendida: { label: 'Atendida', bg: '#e8f0e8', color: '#4a734a' },
  cerrada: { label: 'Cerrada', bg: '#f7f6f4', color: '#8b7d74' },
};

const formatFecha = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

export default function MisSolicitudes() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Sin sesión, de vuelta al Inicio (a Login solo se llega cuando el usuario lo pide)
  useEffect(() => {
    if (!isAuthenticated) router.replace('/(tabs)');
  }, [isAuthenticated, router]);

  const cargar = useCallback(async () => {
    try {
      const data = await solicitudService.getAll();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch {
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) cargar();
  }, [isAuthenticated, cargar]);

  const onRefresh = async () => {
    setRefreshing(true);
    await cargar();
    setRefreshing(false);
  };

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <AppText variant="h1" style={{ fontSize: 24 }}>Mis Solicitudes</AppText>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : solicitudes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <MaterialIcons name="request-quote" size={64} color={BORDER} />
          <AppText variant="bodyStrong" style={{ marginTop: 12 }}>Aún no tienes solicitudes</AppText>
          <AppText variant="bodyMuted" style={{ textAlign: 'center', marginTop: 4 }}>
            Pide una cotización desde un producto o desde tus favoritos.
          </AppText>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/ProductosScreen')}
            style={{ marginTop: 20, backgroundColor: PRIMARY, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 28 }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Explorar productos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 12, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY]} />}
        >
          {solicitudes.map((s: any) => {
            const estado = ESTADOS[s.estado] || ESTADOS.pendiente;
            return (
              <View
                key={s._id}
                style={{ backgroundColor: SURFACE, borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 16, marginBottom: 12 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, color: TEXT_MUTED }}>{formatFecha(s.createdAt)}</Text>
                  <View style={{ backgroundColor: estado.bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
                    <Text style={{ color: estado.color, fontWeight: '700', fontSize: 11 }}>{estado.label}</Text>
                  </View>
                </View>

                <Text style={{ fontSize: 14, fontWeight: '600', color: TEXT_DARK, marginBottom: 4 }}>
                  {(s.productos?.length || 0)} producto(s)
                </Text>
                {(s.productos || []).slice(0, 4).map((p: any, i: number) => (
                  <View key={p.productoId || i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <MaterialIcons name="chevron-right" size={14} color={PRIMARY} />
                    <Text style={{ fontSize: 13, color: TEXT_DARK }} numberOfLines={1}>{p.nombre || 'Producto'}</Text>
                  </View>
                ))}
                {s.productos?.length > 4 ? (
                  <Text style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>y {s.productos.length - 4} más…</Text>
                ) : null}

                {s.mensaje ? (
                  <Text style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 8, fontStyle: 'italic' }}>“{s.mensaje}”</Text>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
