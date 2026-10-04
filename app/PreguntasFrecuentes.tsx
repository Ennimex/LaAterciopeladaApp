import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { publicAPI } from '../services/api';

type Pregunta = { _id: string; pregunta: string; respuesta: string };

export default function PreguntasFrecuentes() {
  const router = useRouter();
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [abierta, setAbierta] = useState<string | null>(null);

  useEffect(() => {
    publicAPI
      .getPreguntasFrecuentes()
      .then(setPreguntas)
      .catch(() => setPreguntas([]))
      .finally(() => setCargando(false));
  }, []);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={12} accessibilityLabel="Volver">
          <MaterialIcons name="arrow-back" size={24} color="#2a241f" />
        </Pressable>
        <Text style={styles.title}>Preguntas frecuentes</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {cargando && <ActivityIndicator color="#d63384" />}
        {!cargando && preguntas.length === 0 && <Text style={styles.vacio}>Aún no hay preguntas publicadas.</Text>}
        {preguntas.map((p) => {
          const abiertaEsta = abierta === p._id;
          return (
            <View key={p._id} style={styles.item}>
              <Pressable style={styles.pregunta} onPress={() => setAbierta(abiertaEsta ? null : p._id)}>
                <Text style={styles.preguntaTexto}>{p.pregunta}</Text>
                <MaterialIcons name={abiertaEsta ? 'expand-less' : 'expand-more'} size={24} color="#8b7d74" />
              </Pressable>
              {abiertaEsta && <Text style={styles.respuesta}>{p.respuesta}</Text>}
            </View>
          );
        })}
        <Pressable style={styles.enlace} onPress={() => router.push('/Buzon')}>
          <MaterialIcons name="rate-review" size={20} color="#d63384" />
          <Text style={styles.enlaceTexto}>Déjanos una queja o sugerencia</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#faf6ee' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#2a241f' },
  content: { padding: 16, paddingBottom: 40 },
  vacio: { color: '#8b7d74', textAlign: 'center', marginTop: 24 },
  item: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ede9e6', marginBottom: 10 },
  pregunta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, gap: 10 },
  preguntaTexto: { flex: 1, fontSize: 15, fontWeight: '600', color: '#2a241f' },
  respuesta: { paddingHorizontal: 14, paddingBottom: 14, fontSize: 14, lineHeight: 20, color: '#5c524b' },
  enlace: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 },
  enlaceTexto: { color: '#d63384', fontWeight: '600' },
});
