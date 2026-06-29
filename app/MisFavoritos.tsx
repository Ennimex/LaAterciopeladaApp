import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/ui/AppText';
import { useAuth } from '../context/AuthProvider';
import { useFavoritos } from '../context/FavoritosContext';
import solicitudService from '../services/solicitudService';

const PRIMARY = '#d63384';
const SAGE = '#6b9b6b';
const BG = '#faf6ee';
const SURFACE = '#ffffff';
const TEXT_DARK = '#2a241f';
const TEXT_MUTED = '#8b7d74';
const BORDER = '#ede9e6';

export default function MisFavoritos() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { favoritos, toggleFavorito, loading } = useFavoritos();
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/LoginScreen');
  }, [isAuthenticated, router]);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  const localidadNombre = (p: any) =>
    typeof p.localidadId === 'object' ? p.localidadId?.nombre : p.localidad?.nombre || '';

  const solicitarTodos = async () => {
    if (favoritos.length === 0) return;
    Alert.alert(
      'Solicitar cotización',
      `¿Enviar una solicitud de cotización de tus ${favoritos.length} producto(s) favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async () => {
            try {
              setEnviando(true);
              await solicitudService.create({
                productos: favoritos.map((p: any) => ({ productoId: p._id, nombre: p.nombre, imagenURL: p.imagenURL })),
                mensaje: 'Solicitud desde Mis Favoritos',
              });
              Alert.alert('✅ Enviada', 'Tu solicitud de cotización fue enviada.', [
                { text: 'Ver mis solicitudes', onPress: () => router.push('/MisSolicitudes') },
                { text: 'OK' },
              ]);
            } catch (e: any) {
              Alert.alert('Error', e?.error || 'No se pudo enviar la solicitud.');
            } finally {
              setEnviando(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <AppText variant="h1" style={{ fontSize: 24 }}>Mis Favoritos</AppText>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : favoritos.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <MaterialIcons name="favorite-border" size={64} color={BORDER} />
          <AppText variant="bodyStrong" style={{ marginTop: 12 }}>Aún no tienes favoritos</AppText>
          <AppText variant="bodyMuted" style={{ textAlign: 'center', marginTop: 4 }}>
            Toca el corazón en un producto para guardarlo aquí.
          </AppText>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/ProductosScreen')}
            style={{ marginTop: 20, backgroundColor: PRIMARY, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 28 }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Explorar productos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={solicitarTodos}
            disabled={enviando}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: SAGE, borderRadius: 12, paddingVertical: 13, marginBottom: 14, opacity: enviando ? 0.7 : 1 }}
          >
            {enviando ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="request-quote" size={18} color="#fff" />}
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Solicitar cotización de todos</Text>
          </TouchableOpacity>

          {favoritos.map((p: any) => (
            <View
              key={p._id}
              style={{ flexDirection: 'row', backgroundColor: SURFACE, borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 10, marginBottom: 10, alignItems: 'center' }}
            >
              <View style={{ width: 70, height: 70, borderRadius: 10, backgroundColor: '#f7f6f4', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
                {p.imagenURL ? (
                  <Image source={{ uri: p.imagenURL }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <MaterialIcons name="checkroom" size={28} color={TEXT_MUTED} />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: TEXT_DARK }} numberOfLines={1}>{p.nombre}</Text>
                {p.tipoTela ? <Text style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 2 }} numberOfLines={1}>{p.tipoTela}</Text> : null}
                {localidadNombre(p) ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <MaterialIcons name="place" size={13} color={TEXT_MUTED} />
                    <Text style={{ fontSize: 12, color: TEXT_MUTED }}>{localidadNombre(p)}</Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => toggleFavorito(p)} style={{ padding: 8 }}>
                <Ionicons name="heart" size={24} color={PRIMARY} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
