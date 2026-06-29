import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/ui/AppText';
import { Hero } from '../components/ui/Hero';
import { publicAPI } from '../services/api';

const PRIMARY = '#d63384';
const BG = '#faf6ee';
const SURFACE = '#ffffff';
const TEXT_DARK = '#2a241f';
const TEXT_MUTED = '#8b7d74';
const BORDER = '#ede9e6';

export default function Nosotros() {
  const router = useRouter();
  const [nosotros, setNosotros] = useState<any>(null);
  const [valores, setValores] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [n, v, c] = await Promise.all([
          publicAPI.getNosotros().catch(() => null),
          publicAPI.getValores().catch(() => []),
          publicAPI.getColaboradores().catch(() => []),
        ]);
        setNosotros(n);
        setValores(Array.isArray(v) ? v : []);
        setColaboradores(Array.isArray(c) ? c : []);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  const Bloque = ({ titulo, texto }: { titulo: string; texto?: string }) =>
    texto ? (
      <View style={{ backgroundColor: SURFACE, borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 16, marginHorizontal: 12, marginBottom: 12 }}>
        <AppText variant="h2" style={{ fontSize: 18, marginBottom: 6 }}>{titulo}</AppText>
        <AppText variant="body">{texto}</AppText>
      </View>
    ) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top', 'left', 'right']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <Hero
            eyebrow="Quiénes somos"
            title="Nosotros"
            subtitle="Artesanía huasteca hecha a mano, con raíces y corazón."
          />

          <View style={{ height: 16 }} />
          <Bloque titulo="Misión" texto={nosotros?.mision} />
          <Bloque titulo="Visión" texto={nosotros?.vision} />
          <Bloque titulo="Historia" texto={nosotros?.historia} />

          {valores.length > 0 && (
            <>
              <AppText variant="h2" style={{ marginHorizontal: 12, marginTop: 12, marginBottom: 8 }}>Nuestros valores</AppText>
              {valores.map((v: any) => (
                <View key={v._id || v.nombre} style={{ flexDirection: 'row', gap: 10, backgroundColor: SURFACE, borderRadius: 12, borderWidth: 1, borderColor: BORDER, padding: 14, marginHorizontal: 12, marginBottom: 10 }}>
                  <MaterialIcons name="auto-awesome" size={20} color={PRIMARY} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: TEXT_DARK }}>{v.nombre}</Text>
                    {v.descripcion ? <Text style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 2, lineHeight: 18 }}>{v.descripcion}</Text> : null}
                  </View>
                </View>
              ))}
            </>
          )}

          {colaboradores.length > 0 && (
            <>
              <AppText variant="h2" style={{ marginHorizontal: 12, marginTop: 12, marginBottom: 8 }}>Nuestro equipo</AppText>
              {colaboradores.map((c: any) => {
                const foto = c.foto || c.imagenURL || c.imagen;
                return (
                  <View key={c._id || c.nombre} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: SURFACE, borderRadius: 12, borderWidth: 1, borderColor: BORDER, padding: 12, marginHorizontal: 12, marginBottom: 10 }}>
                    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#fce7eb', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
                      {foto ? (
                        <Image source={{ uri: foto }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : (
                        <Text style={{ fontSize: 22, fontWeight: '700', color: PRIMARY }}>{(c.nombre || '?').charAt(0).toUpperCase()}</Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: TEXT_DARK }}>{c.nombre}</Text>
                      {c.rol ? <Text style={{ fontSize: 13, color: PRIMARY, marginTop: 1 }}>{c.rol}</Text> : null}
                      {c.descripcion ? <Text style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }} numberOfLines={2}>{c.descripcion}</Text> : null}
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
