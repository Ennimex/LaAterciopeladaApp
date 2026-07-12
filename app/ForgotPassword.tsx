import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText } from '../components/ui/AppText';
import { authAPI } from '../services/api';
import { stylesGlobal } from '../styles/stylesGlobal';

const primary = stylesGlobal.colors.primary[500] as string;
const textSecondary = stylesGlobal.colors.text.secondary as string;
const textMuted = stylesGlobal.colors.text.muted as string;
const errorColor = stylesGlobal.colors.semantic.error.main as string;
const surface = stylesGlobal.colors.surface.primary as string;

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/LoginScreen'));

  const handleEnviar = async () => {
    setError('');
    const correo = email.trim();
    if (!correo) {
      setError('Escribe tu correo electrónico.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(correo)) {
      setError('El correo no es válido.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.forgotPassword(correo);
      setEnviado(true);
    } catch (e: any) {
      setError(e?.error || 'No se pudo enviar el correo. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color={primary} />
        <Text style={styles.backText}>Regresar</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <Ionicons name={enviado ? 'mail-open-outline' : 'lock-open-outline'} size={36} color={primary} />
        </View>

        {enviado ? (
          <>
            <AppText variant="h1" style={styles.title}>
              Revisa tu correo
            </AppText>
            <AppText variant="body" style={styles.subtitle}>
              Si <Text style={{ fontWeight: '700' }}>{email.trim()}</Text> está registrado, te enviamos
              un enlace para crear una nueva contraseña. El enlace se abre en nuestro sitio web y es
              válido por tiempo limitado.
            </AppText>
            <AppText variant="bodyMuted" style={styles.hint}>
              ¿No llega? Revisa tu carpeta de spam o correo no deseado.
            </AppText>
            <TouchableOpacity style={styles.button} onPress={() => router.replace('/LoginScreen')}>
              <Text style={styles.buttonText}>Volver a iniciar sesión</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <AppText variant="h1" style={styles.title}>
              ¿Olvidaste tu contraseña?
            </AppText>
            <AppText variant="body" style={styles.subtitle}>
              Escribe el correo de tu cuenta y te enviaremos las instrucciones para restablecerla.
            </AppText>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoFocus
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleEnviar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Enviar instrucciones</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backText: {
    color: primary,
    fontSize: 15,
    fontWeight: '500',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fdf0f6',
    borderWidth: 1,
    borderColor: '#f5d3e4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: textSecondary,
    marginBottom: 24,
  },
  hint: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
    color: stylesGlobal.colors.text.primary as string,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd6d1',
    borderRadius: 10,
    marginBottom: 16,
  },
  error: {
    color: errorColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
