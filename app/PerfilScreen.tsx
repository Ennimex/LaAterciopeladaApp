import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthProvider';
import { profileService } from '../services/profileService';
import { stylesGlobal } from '../styles/stylesGlobal';

type Tab = 'info' | 'password';

const PerfilScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('info');

  // Datos del perfil
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const primary = stylesGlobal.colors.primary[500] as string;
  const textPrimary = stylesGlobal.colors.text.primary as string;
  const textSecondary = stylesGlobal.colors.text.secondary as string;
  const textMuted = stylesGlobal.colors.text.muted as string;
  const surfacePrimary = stylesGlobal.colors.surface.primary as string;
  const surfaceSecondary = stylesGlobal.colors.surface.secondary as string;
  const errorColor = stylesGlobal.colors.semantic.error.main as string;

  const loadProfile = useCallback(async () => {
    // Pantalla solo para usuarios autenticados: sin sesión no se pide el perfil.
    if (!user) {
      setLoadingProfile(false);
      return;
    }
    try {
      setLoadingProfile(true);
      const data = await profileService.getProfile();
      setName(data.name || data.nombre || user?.name || '');
      setEmail(data.email || user?.email || '');
      setPhone(data.phone || data.telefono || '');
    } catch {
      setName(user?.name || '');
      setEmail(user?.email || '');
    } finally {
      setLoadingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Si no hay sesión, salir del Perfil al Inicio (evita pedir /perfil sin token → 401
  // en bucle, y que el Login aparezca sin que el usuario lo haya pedido)
  useEffect(() => {
    if (!user) router.replace('/(tabs)');
  }, [user, router]);

  const handleSaveProfile = async () => {
    const validation = profileService.validateProfile({ name, email, phone });
    if (!validation.isValid) {
      Alert.alert('Datos inválidos', validation.errors.join('\n'));
      return;
    }

    try {
      setSavingProfile(true);
      await profileService.updateProfile({ name, email, phone });
      Alert.alert('✅ Éxito', 'Perfil actualizado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error?.error || 'No se pudo actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    const validation = profileService.validatePasswordChange({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!validation.isValid) {
      Alert.alert('Datos inválidos', validation.errors.join('\n'));
      return;
    }

    try {
      setSavingPassword(true);
      await profileService.updatePassword({ currentPassword, newPassword });
      Alert.alert('✅ Éxito', 'Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Error', error?.error || 'No se pudo actualizar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: surfaceSecondary },
    header: {
      backgroundColor: surfacePrimary,
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: stylesGlobal.borders.colors.default,
    },
    avatarCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: stylesGlobal.colors.primary[100] as string,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 2,
      borderColor: primary,
    },
    avatarInitials: {
      fontSize: 28,
      fontWeight: '700',
      color: primary,
    },
    headerName: {
      fontSize: 20,
      fontWeight: '700',
      color: textPrimary,
      marginBottom: 4,
    },
    headerEmail: {
      fontSize: 14,
      color: textSecondary,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: surfacePrimary,
      borderBottomWidth: 1,
      borderBottomColor: stylesGlobal.borders.colors.default,
    },
    tab: {
      flex: 1,
      paddingVertical: 14,
      alignItems: 'center',
    },
    tabActive: {
      borderBottomWidth: 2,
      borderBottomColor: primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: textMuted,
    },
    tabTextActive: {
      color: primary,
      fontWeight: '600',
    },
    content: {
      padding: 20,
    },
    card: {
      backgroundColor: surfacePrimary,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: surfacePrimary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 10,
    },
    navItemText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: textPrimary,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: textSecondary,
      marginBottom: 6,
      marginTop: 16,
    },
    input: {
      backgroundColor: surfaceSecondary,
      borderWidth: 1,
      borderColor: stylesGlobal.borders.colors.muted,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: textPrimary,
    },
    inputFocused: {
      borderColor: primary,
    },
    passwordWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: surfaceSecondary,
      borderWidth: 1,
      borderColor: stylesGlobal.borders.colors.muted,
      borderRadius: 10,
    },
    passwordInput: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: textPrimary,
    },
    eyeBtn: {
      paddingHorizontal: 12,
    },
    saveBtn: {
      backgroundColor: primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 24,
    },
    saveBtnText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: surfacePrimary,
      borderRadius: 10,
      paddingVertical: 14,
      marginTop: 8,
      borderWidth: 1.5,
      borderColor: errorColor,
      gap: 8,
    },
    logoutText: {
      color: errorColor,
      fontWeight: '600',
      fontSize: 15,
    },
  });

  const getInitials = () => {
    if (name) return name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  if (loadingProfile) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: surfaceSecondary }}>
        <ActivityIndicator size="large" color={primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header con avatar */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{getInitials()}</Text>
          </View>
          <Text style={styles.headerName}>{name || 'Mi Perfil'}</Text>
          <Text style={styles.headerEmail}>{email}</Text>
        </View>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.tabActive]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
              Información
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'password' && styles.tabActive]}
            onPress={() => setActiveTab('password')}
          >
            <Text style={[styles.tabText, activeTab === 'password' && styles.tabTextActive]}>
              Contraseña
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            {/* Tab Información */}
            {activeTab === 'info' && (
              <View style={styles.card}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: textPrimary, marginBottom: 4 }}>
                  Datos personales
                </Text>
                <Text style={{ fontSize: 13, color: textSecondary, marginBottom: 8 }}>
                  Actualiza tu información de perfil
                </Text>

                <Text style={styles.label}>Nombre completo</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre"
                  placeholderTextColor={textMuted}
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  placeholderTextColor={textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+521234567890"
                  placeholderTextColor={textMuted}
                  keyboardType="phone-pad"
                />

                <TouchableOpacity
                  style={[styles.saveBtn, savingProfile && { opacity: 0.7 }]}
                  onPress={handleSaveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.saveBtnText}>Guardar cambios</Text>
                  }
                </TouchableOpacity>
              </View>
            )}

            {/* Tab Contraseña */}
            {activeTab === 'password' && (
              <View style={styles.card}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: textPrimary, marginBottom: 4 }}>
                  Cambiar contraseña
                </Text>
                <Text style={{ fontSize: 13, color: textSecondary, marginBottom: 8 }}>
                  Ingresa tu contraseña actual y la nueva
                </Text>

                <Text style={styles.label}>Contraseña actual</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Contraseña actual"
                    placeholderTextColor={textMuted}
                    secureTextEntry={!showCurrent}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowCurrent(!showCurrent)}>
                    <Ionicons name={showCurrent ? 'eye-off' : 'eye'} size={20} color={textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Nueva contraseña</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Nueva contraseña"
                    placeholderTextColor={textMuted}
                    secureTextEntry={!showNew}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowNew(!showNew)}>
                    <Ionicons name={showNew ? 'eye-off' : 'eye'} size={20} color={textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Confirmar nueva contraseña</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor={textMuted}
                    secureTextEntry={!showConfirm}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(!showConfirm)}>
                    <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color={textMuted} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.saveBtn, savingPassword && { opacity: 0.7 }]}
                  onPress={handleSavePassword}
                  disabled={savingPassword}
                >
                  {savingPassword
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.saveBtnText}>Cambiar contraseña</Text>
                  }
                </TouchableOpacity>
              </View>
            )}

            {/* Accesos del usuario registrado */}
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/MisFavoritos')}>
              <Ionicons name="heart-outline" size={20} color={primary} />
              <Text style={styles.navItemText}>Mis Favoritos</Text>
              <Ionicons name="chevron-forward" size={18} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/MisSolicitudes')}>
              <Ionicons name="document-text-outline" size={20} color={primary} />
              <Text style={styles.navItemText}>Mis Solicitudes</Text>
              <Ionicons name="chevron-forward" size={18} color={textMuted} />
            </TouchableOpacity>

            {/* Botón cerrar sesión — siempre visible */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={errorColor} />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PerfilScreen;