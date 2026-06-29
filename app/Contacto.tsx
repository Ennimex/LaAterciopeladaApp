import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/ui/AppText';
import { Hero } from '../components/ui/Hero';
import { publicAPI } from '../services/api';

const PRIMARY = '#d63384';
const SAGE = '#6b9b6b';
const BG = '#faf6ee';
const SURFACE = '#ffffff';
const TEXT_DARK = '#2a241f';
const TEXT_MUTED = '#8b7d74';
const BORDER = '#ddd6d1';

export default function Contacto() {
  const router = useRouter();
  const [config, setConfig] = useState<any>(null);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    publicAPI.getConfiguracion().then(setConfig).catch(() => setConfig(null));
  }, []);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  const waNumber = String(config?.redesSociales?.whatsapp || '527711234567').replace(/\D/g, '');
  const abrirWhatsApp = () =>
    Linking.openURL(`https://wa.me/${waNumber}`).catch(() => Alert.alert('Error', 'No se pudo abrir WhatsApp.'));

  const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const enviar = async () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
      Alert.alert('Faltan datos', 'Nombre, correo y mensaje son obligatorios.');
      return;
    }
    if (!validEmail(form.email.trim())) {
      Alert.alert('Correo inválido', 'Escribe un correo válido.');
      return;
    }
    try {
      setEnviando(true);
      await publicAPI.enviarContacto({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        mensaje: form.mensaje.trim(),
      });
      Alert.alert('✅ Enviado', 'Mensaje enviado. Te responderemos pronto.');
      setForm({ nombre: '', email: '', telefono: '', mensaje: '' });
    } catch (e: any) {
      Alert.alert('Error', e?.error || 'No se pudo enviar el mensaje.');
    } finally {
      setEnviando(false);
    }
  };

  const InfoRow = ({ icon, label, value }: { icon: any; label: string; value?: string }) =>
    value ? (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
        <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#fce7eb', justifyContent: 'center', alignItems: 'center' }}>
          <MaterialIcons name={icon} size={18} color={PRIMARY} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: TEXT_MUTED }}>{label}</Text>
          <Text style={{ fontSize: 14, color: TEXT_DARK, fontWeight: '500' }}>{value}</Text>
        </View>
      </View>
    ) : null;

  const input = {
    backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: TEXT_DARK, marginTop: 10,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top', 'left', 'right']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Hero eyebrow="Hablemos" title="Contacto" subtitle="¿Tienes dudas o un encargo? Escríbenos." />

          {/* Info del negocio */}
          <View style={{ backgroundColor: SURFACE, borderRadius: 14, borderWidth: 1, borderColor: '#ede9e6', padding: 16, margin: 12 }}>
            <InfoRow icon="place" label="Dirección" value={config?.direccion} />
            <InfoRow icon="phone" label="Teléfono" value={config?.telefono} />
            <InfoRow icon="email" label="Correo" value={config?.email} />
            <TouchableOpacity
              onPress={abrirWhatsApp}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: SAGE, borderRadius: 12, paddingVertical: 13, marginTop: 12 }}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Escríbenos por WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Formulario */}
          <View style={{ backgroundColor: SURFACE, borderRadius: 14, borderWidth: 1, borderColor: '#ede9e6', padding: 16, marginHorizontal: 12 }}>
            <AppText variant="h2" style={{ fontSize: 18, marginBottom: 2 }}>Envíanos un mensaje</AppText>
            <TextInput style={input} placeholder="Nombre *" placeholderTextColor={TEXT_MUTED} value={form.nombre} onChangeText={(t) => setForm({ ...form, nombre: t })} />
            <TextInput style={input} placeholder="Correo *" placeholderTextColor={TEXT_MUTED} value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={input} placeholder="Teléfono" placeholderTextColor={TEXT_MUTED} value={form.telefono} onChangeText={(t) => setForm({ ...form, telefono: t })} keyboardType="phone-pad" />
            <TextInput style={[input, { minHeight: 100, textAlignVertical: 'top' }]} placeholder="Mensaje *" placeholderTextColor={TEXT_MUTED} value={form.mensaje} onChangeText={(t) => setForm({ ...form, mensaje: t })} multiline />
            <TouchableOpacity
              onPress={enviar}
              disabled={enviando}
              style={{ backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16, opacity: enviando ? 0.7 : 1 }}
            >
              {enviando ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Enviar mensaje</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
