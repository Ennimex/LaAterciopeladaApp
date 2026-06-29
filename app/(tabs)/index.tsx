import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthProvider';
import { publicAPI } from '../../services/api';
import { globalStyles, mobileHelpers, stylesGlobal } from '../../styles/stylesGlobal';
import { AppText } from '../../components/ui/AppText';
import { Hero } from '../../components/ui/Hero';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ProductosScreen: { localidad: string };
};

// Ícono fijo por categoría usando MaterialIcons
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

const getCategoriaIconName = (nombre: string): MaterialIconName => {
  const nombreLower = nombre.toLowerCase();
  if (nombreLower.match(/restaurant|comida|aliment|café|bar|pizza|taco|sushi/)) return 'restaurant';
  if (nombreLower.match(/entreten|divers|espectác|teatro|cine|juego/)) return 'theater-comedy';
  if (nombreLower.match(/deport|fitness|gym|ejercicio|futbol|tenis/)) return 'sports-soccer';
  if (nombreLower.match(/servicio|profesional|técnico|reparación/)) return 'build';
  if (nombreLower.match(/compra|tienda|ropa|calzado|mercado|comercio/)) return 'shopping-bag';
  if (nombreLower.match(/salud|médico|hospital|clínica|consultorio/)) return 'local-hospital';
  if (nombreLower.match(/belleza|estética|spa|peluquer|manicur/)) return 'face';
  if (nombreLower.match(/educación|escuela|curso|academia|universidad/)) return 'school';
  if (nombreLower.match(/negocio|empresa|corporativ|oficina/)) return 'business';
  if (nombreLower.match(/textil|artesanal|bordado|huastec|tela|ropa/)) return 'checkroom';
  return 'category';
};

const InicioScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => { loadInitialData(); }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const categoriasResponse = await publicAPI.getCategorias();
      const categoriasConImagenes = categoriasResponse.data.map((categoria: any) => ({
        ...categoria,
        id: categoria._id || categoria.id,
        hasImage: !!categoria.imagenURL
      }));

      let localidadesConEmpresas: any[] = [];
      try {
        const localidadesResponse = await publicAPI.getLocalidades();
        if (Array.isArray(localidadesResponse)) {
          localidadesConEmpresas = localidadesResponse.map((localidad: any) => ({
            ...localidad,
            id: localidad._id || localidad.id
          }));
        }
      } catch (localidadesError) {
        console.error("Error al cargar localidades:", localidadesError);
      }

      setCategorias(categoriasConImagenes);
      setLocalidades(localidadesConEmpresas);
    } catch (error: any) {
      Alert.alert("Error cargando categorías", error?.error || error?.message || "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleCategoriaPress = (categoria: any) => {
    Alert.alert(
      categoria.nombre,
      `${categoria.descripcion || "Explora esta categoría"}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Ver Productos", onPress: () => {} }
      ]
    );
  };

  const handleLocalidadPress = (localidad: any) => {
    navigation.navigate("ProductosScreen", { localidad: localidad.nombre });
  };

  const handleExplorarServicios = () => {
    router.push('/(tabs)/ServiciosScreen');
  };

  const primary = stylesGlobal.colors.primary[500] as string;

  const dynamicStyles = StyleSheet.create({
    heroActions: {
      backgroundColor: stylesGlobal.colors.primary[50] as string,
      paddingHorizontal: stylesGlobal.spacing.mobile.content,
      paddingTop: stylesGlobal.spacing.scale[2],
      paddingBottom: stylesGlobal.spacing.scale[6],
      alignItems: "center" as const
    },
    sectionTitle: {
      marginBottom: stylesGlobal.spacing.scale[4],
      marginTop: stylesGlobal.spacing.scale[8]
    },
    categoryCard: {
      backgroundColor: stylesGlobal.colors.surface.primary as string,
      borderRadius: 12,
      padding: stylesGlobal.spacing.scale[4],
      marginRight: stylesGlobal.spacing.scale[3],
      marginBottom: stylesGlobal.spacing.scale[3],
      width: mobileHelpers.screen.width * 0.4,
      alignItems: "center" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3
    },
    // Tarjeta de localidad — sin ícono, más tipográfica
    localidadCard: {
      backgroundColor: stylesGlobal.colors.surface.primary as string,
      borderRadius: 10,
      paddingVertical: 16,
      paddingHorizontal: 18,
      marginBottom: stylesGlobal.spacing.scale[3],
      flexDirection: "row" as const,
      alignItems: "center" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderLeftWidth: 3,
      borderLeftColor: primary,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={globalStyles.screenBase}>
        <StatusBar barStyle="dark-content" backgroundColor={stylesGlobal.colors.surface.primary as string} />
        <View style={globalStyles.screenCentered}>
          <Text style={{ fontSize: stylesGlobal.typography.scale.lg, color: stylesGlobal.colors.text.secondary as string }}>
            Cargando...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.screenBase}>
      <StatusBar barStyle="dark-content" backgroundColor={stylesGlobal.colors.surface.primary as string} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero Section */}
        <Hero
          eyebrow="La Aterciopelada"
          title="Vestimenta de Danza Huasteca"
          subtitle="Piezas bordadas a mano que honran nuestra herencia textil."
        />

        <View style={dynamicStyles.heroActions}>
          <TouchableOpacity
            style={[globalStyles.buttonBase, globalStyles.buttonPrimary, { marginBottom: stylesGlobal.spacing.scale[3] }]}
            onPress={handleExplorarServicios}
          >
            <Text style={{ color: stylesGlobal.colors.primary.contrast as string, fontWeight: stylesGlobal.typography.weights.semibold as any }}>
              Explorar Servicios
            </Text>
          </TouchableOpacity>

          {!isAuthenticated && (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: stylesGlobal.spacing.scale[2] }}>
              <TouchableOpacity
                style={{ backgroundColor: primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10, alignItems: 'center' }}
                onPress={() => router.push('/LoginScreen')}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1.5, borderColor: primary, alignItems: 'center' }}
                onPress={() => router.push('/RegisterScreen')}
              >
                <Text style={{ color: primary, fontWeight: '600', fontSize: 15 }}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          )}

          {isAuthenticated && user && (
            <TouchableOpacity
              onPress={() => router.push('/PerfilScreen')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: stylesGlobal.spacing.scale[2] }}
            >
              <Text style={{ color: stylesGlobal.colors.text.secondary as string, fontSize: 14 }}>
                Bienvenido, {user.name || user.email} 👋
              </Text>
              <MaterialIcons name="chevron-right" size={16} color={stylesGlobal.colors.text.muted as string} />
            </TouchableOpacity>
          )}
        </View>

        {/* Contenido Principal */}
        <View style={globalStyles.screenContent}>

          {/* Categorías */}
          <AppText variant="h2" style={dynamicStyles.sectionTitle}>Categorías</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: stylesGlobal.spacing.scale[4] }}
          >
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={dynamicStyles.categoryCard}
                onPress={() => handleCategoriaPress(categoria)}
              >
                {categoria.imagenURL && categoria.hasImage ? (
                  <Image
                    source={{ uri: categoria.imagenURL }}
                    style={{ width: 60, height: 60, borderRadius: 30, marginBottom: stylesGlobal.spacing.scale[2] }}
                    resizeMode="cover"
                  />
                ) : (
                  // Ícono fijo de MaterialIcons por tipo de categoría
                  <View style={{
                    width: 60, height: 60, borderRadius: 30,
                    backgroundColor: stylesGlobal.colors.primary[50] as string,
                    justifyContent: "center", alignItems: "center",
                    marginBottom: stylesGlobal.spacing.scale[2],
                    borderWidth: 1,
                    borderColor: stylesGlobal.colors.primary[200] as string,
                  }}>
                    <MaterialIcons
                      name={getCategoriaIconName(categoria.nombre)}
                      size={28}
                      color={primary}
                    />
                  </View>
                )}
                <Text style={{
                  fontSize: stylesGlobal.typography.scale.sm,
                  fontWeight: stylesGlobal.typography.weights.semibold as any,
                  color: stylesGlobal.colors.text.primary as string,
                  textAlign: "center",
                  marginBottom: stylesGlobal.spacing.scale[1]
                }}>
                  {categoria.nombre}
                </Text>
                <Text style={{
                  fontSize: stylesGlobal.typography.scale.xs,
                  color: stylesGlobal.colors.text.tertiary as string,
                  textAlign: "center"
                }}>
                  {categoria.descripcion}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Localidades — sin ícono, tipografía limpia */}
          <AppText variant="h2" style={dynamicStyles.sectionTitle}>Explora por Localidades</AppText>
          {localidades.map((localidad) => (
            <TouchableOpacity
              key={localidad.id}
              style={dynamicStyles.localidadCard}
              onPress={() => handleLocalidadPress(localidad)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: stylesGlobal.colors.text.primary as string,
                  letterSpacing: 0.2,
                }}>
                  {localidad.nombre}
                </Text>
                {localidad.descripcion ? (
                  <Text style={{
                    fontSize: 13,
                    color: stylesGlobal.colors.text.secondary as string,
                    marginTop: 2,
                  }}>
                    {localidad.descripcion}
                  </Text>
                ) : null}
              </View>
              <MaterialIcons name="chevron-right" size={22} color={stylesGlobal.colors.text.muted as string} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InicioScreen;