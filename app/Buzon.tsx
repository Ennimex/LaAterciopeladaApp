import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { publicAPI } from '../services/api';

type Tipo = 'queja' | 'sugerencia' | 'felicitacion';
const TIPOS: { valor: Tipo; etiqueta: string }[] = [
  { valor: 'queja', etiqueta: 'Queja' },
  { valor: 'sugerencia', etiqueta: 'Sugerencia' },
  { valor: 'felicitacion', etiqueta: 'Felicitación' },
];

export default function Buzon() {
  const router = useRouter();
  const [tipo, setTipo] = useState<Tipo>('sugerencia');
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [quiereContacto, setQuiereContacto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  const enviar = async () => {
    if (!form.mensaje.trim()) {
      Alert.alert('Falta el mensaje', 'Escribe tu mensaje.');
      return;
    }
    if (quiereContacto && !form.email.trim() && !form.telefono.trim()) {
      Alert.alert('Faltan datos', 'Para contactarte necesitamos tu correo o tu teléfono.');
      return;
    }
    try {
      setEnviando(true);
      await publicAPI.enviarBuzon({
        tipo,
        mensaje: form.mensaje.trim(),
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        quiereContacto,
      });
      Alert.alert('Gracias', 'Recibimos tu mensaje.', [{ text: 'Cerrar', onPress: goBack }]);
      setForm({ nombre: '', email: '', telefono: '', mensaje: '' });
      setQuiereContacto(false);
    } catch (e: any) {
      Alert.alert('Error', e?.error || 'No se pudo enviar el mensaje.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={12} accessibilityLabel="Volver">
          <MaterialIcons name="arrow-back" size={24} color="#2a241f" />
        </Pressable>
        <Text style={styles.title}>Quejas y sugerencias</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>Cuéntanos qué podemos mejorar o qué te gustó. Puedes escribir sin dejar tu nombre.</Text>

        <Text style={styles.label}>Tipo de mensaje</Text>
        <View style={styles.tipos}>
          {TIPOS.map((t) => (
            <Pressable key={t.valor} style={[styles.chip, tipo === t.valor && styles.chipActivo]} onPress={() => setTipo(t.valor)}>
              <Text style={[styles.chipTexto, tipo === t.valor && styles.chipTextoActivo]}>{t.etiqueta}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Mensaje</Text>
        <TextInput style={[styles.input, styles.area]} multiline maxLength={2000} value={form.mensaje} onChangeText={(v) => setForm({ ...form, mensaje: v })} placeholder="Escribe aquí" placeholderTextColor="#b5aaa2" />

        <Text style={styles.label}>Nombre (opcional)</Text>
        <TextInput style={styles.input} value={form.nombre} onChangeText={(v) => setForm({ ...form, nombre: v })} placeholderTextColor="#b5aaa2" />
        <Text style={styles.label}>Correo (opcional)</Text>
        <TextInput style={styles.input} autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} placeholderTextColor="#b5aaa2" />
        <Text style={styles.label}>Teléfono (opcional)</Text>
        <TextInput style={styles.input} keyboardType="phone-pad" value={form.telefono} onChangeText={(v) => setForm({ ...form, telefono: v })} placeholderTextColor="#b5aaa2" />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Quiero que me contacten</Text>
          <Switch value={quiereContacto} onValueChange={setQuiereContacto} trackColor={{ true: '#d63384' }} />
        </View>

        <Pressable style={[styles.boton, enviando && { opacity: 0.6 }]} onPress={enviar} disabled={enviando}>
          <MaterialIcons name="send" size={18} color="#fff" />
          <Text style={styles.botonTexto}>{enviando ? 'Enviando...' : 'Enviar'}</Text>
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
  intro: { color: '#5c524b', marginBottom: 16, lineHeight: 20 },
  label: { fontWeight: '600', color: '#2a241f', marginBottom: 6, marginTop: 10 },
  tipos: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: '#ede9e6', backgroundColor: '#fff' },
  chipActivo: { backgroundColor: '#d63384', borderColor: '#d63384' },
  chipTexto: { color: '#2a241f', fontWeight: '600' },
  chipTextoActivo: { color: '#fff' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ede9e6', borderRadius: 10, padding: 12, color: '#2a241f' },
  area: { minHeight: 110, textAlignVertical: 'top' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  switchLabel: { color: '#2a241f', fontWeight: '600' },
  boton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#d63384', borderRadius: 12, padding: 14, marginTop: 20 },
  botonTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
