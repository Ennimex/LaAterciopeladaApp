import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { publicAPI } from '../../services/api';
import { globalStyles, stylesGlobal } from '../../styles/stylesGlobal';

// ⚠️ Reemplaza con el número real del negocio (con código de país, sin + ni espacios)
const WHATSAPP_NUMBER = '5218001234567';

interface ProductoData {
  _id?: string;
  nombre: string;
  descripcion?: string;
  tipoTela?: string;
  imagenURL?: string;
  localidadId: string | LocalidadData;
  tallasDisponibles?: (string | TallaData)[];
  localidad?: LocalidadData;
  tallas?: TallaData[];
  categoriaId?: number;
  disponible?: boolean;
  id?: string;
}

interface LocalidadData {
  _id?: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

interface TallaData {
  _id?: string;
  categoriaId?: string;
  genero?: string;
  talla: string;
  rangoEdad?: string;
  medida?: string;
}

interface CategoriaData {
  id?: number | string;
  nombre: string;
  descripcion?: string;
  imagenURL?: string;
  activo?: boolean;
}

const { width } = Dimensions.get('window');

const primary = stylesGlobal.colors.primary[500] as string;
const textPrimary = stylesGlobal.colors.text.primary as string;
const textSecondary = stylesGlobal.colors.text.secondary as string;
const textMuted = stylesGlobal.colors.text.muted as string;
const surfaceSecondary = stylesGlobal.colors.surface.secondary as string;
const surfaceTertiary = stylesGlobal.colors.surface.tertiary as string;

const ProductosScreen: React.FC = () => {
  const [searchTriggered, setSearchTriggered] = useState(false);
  const route = useRoute();
  const localidadParam = (route.params && (route.params as any).localidad) || null;

  const [productos, setProductos] = useState<ProductoData[]>([]);
  const [categorias, setCategorias] = useState<CategoriaData[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<ProductoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductoData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState<string | null>(null);
  const [soloDisponibles] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);

  const tallasUnicas = React.useMemo(() => {
    const tallasSet = new Set<string>();
    productos.forEach(p => {
      p.tallasDisponibles?.forEach(t => {
        if (typeof t === 'string') tallasSet.add(t);
        else if (t?.talla) tallasSet.add(t.talla);
      });
      p.tallas?.forEach(t => { if (t?.talla) tallasSet.add(t.talla); });
    });
    return Array.from(tallasSet);
  }, [productos]);

  const localidadesUnicas = React.useMemo(() => {
    const locs = new Map<string, string>();
    productos.forEach(p => {
      if (typeof p.localidadId === 'string') {
        locs.set(p.localidadId, p.localidad?.nombre || p.localidadId);
      } else if (p.localidadId && typeof p.localidadId === 'object') {
        locs.set(p.localidadId._id || '', p.localidadId.nombre || '');
      }
    });
    return Array.from(locs.entries()).filter(([id, nombre]) => id && nombre);
  }, [productos]);

  useEffect(() => { loadInitialData(); }, []);

  useEffect(() => {
    if (localidadParam && productos.length > 0) {
      const localidadId = (() => {
        for (const p of productos) {
          if (typeof p.localidadId === 'string' && p.localidad?.nombre === localidadParam) return p.localidadId;
          else if (p.localidadId && typeof p.localidadId === 'object' && p.localidadId.nombre === localidadParam) return p.localidadId._id;
        }
        return null;
      })();
      if (localidadId) setSelectedLocalidad(localidadId);
    }
  }, [localidadParam, productos]);

  useEffect(() => {
    let filtered = productos;
    if (selectedTalla) {
      filtered = filtered.filter(p => {
        if (p.tallasDisponibles?.some(t => typeof t === 'string' ? t === selectedTalla : t.talla === selectedTalla)) return true;
        if (p.tallas?.some(t => t.talla === selectedTalla)) return true;
        return false;
      });
    }
    if (selectedLocalidad) {
      filtered = filtered.filter(p => {
        if (typeof p.localidadId === 'string') return p.localidadId === selectedLocalidad;
        if (p.localidadId && typeof p.localidadId === 'object') return p.localidadId._id === selectedLocalidad;
        return false;
      });
    }
    if (soloDisponibles) filtered = filtered.filter(p => p.disponible !== false);
    setFilteredProductos(filtered);
    setSearchTriggered(false);
  }, [productos, selectedTalla, selectedLocalidad, soloDisponibles]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productosResponse, categoriasResponse] = await Promise.all([
        publicAPI.getProductos(),
        publicAPI.getCategorias(),
      ]);
      setProductos(Array.isArray(productosResponse) ? productosResponse : productosResponse.data || []);
      let cats = Array.isArray(categoriasResponse) ? categoriasResponse : categoriasResponse.data || [];
      cats = cats.map((cat: any) => ({ ...cat, id: cat.id ?? cat._id }));
      setCategorias(cats);
    } catch (error: any) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    if (localidadParam && productos.length > 0) {
      const localidadId = (() => {
        for (const p of productos) {
          if (typeof p.localidadId === 'string' && p.localidad?.nombre === localidadParam) return p.localidadId;
          else if (p.localidadId && typeof p.localidadId === 'object' && p.localidadId.nombre === localidadParam) return p.localidadId._id;
        }
        return null;
      })();
      if (localidadId) setSelectedLocalidad(localidadId);
    } else {
      setSelectedLocalidad(null);
    }
    setRefreshing(false);
  }, [localidadParam, productos]);

  const filterProductos = () => {
    let filtered = productos;
    if (selectedTalla) {
      filtered = filtered.filter(p => {
        if (p.tallasDisponibles?.some(t => typeof t === 'string' ? t === selectedTalla : t.talla === selectedTalla)) return true;
        if (p.tallas?.some(t => t.talla === selectedTalla)) return true;
        return false;
      });
    }
    if (selectedLocalidad) {
      filtered = filtered.filter(p => {
        if (typeof p.localidadId === 'string') return p.localidadId === selectedLocalidad;
        if (p.localidadId && typeof p.localidadId === 'object') return p.localidadId._id === selectedLocalidad;
        return false;
      });
    }
    if (soloDisponibles) filtered = filtered.filter(p => p.disponible !== false);
    if (searchQuery.trim() && searchTriggered) {
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProductos(filtered);
  };

  const handleProductPress = (producto: ProductoData) => {
    setSelectedProduct(producto);
    setShowModal(true);
  };

  // Abre WhatsApp con mensaje predefinido sobre el producto
  const handleContactWhatsApp = (producto: ProductoData) => {
    const mensaje = `Hola, estoy interesado/a en el producto: *${producto.nombre}*${producto.tipoTela ? `\nTipo de tela: ${producto.tipoTela}` : ''}. ¿Podría darme más información?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se pudo abrir WhatsApp. Asegúrate de tenerlo instalado.');
        }
      })
      .catch(() => Alert.alert('Error', 'No se pudo abrir WhatsApp.'));
  };

  const getLocalidadNombre = (producto: ProductoData) => {
    if (typeof producto.localidadId === 'string') return producto.localidad?.nombre || producto.localidadId;
    return producto.localidadId?.nombre || 'N/A';
  };

  const getCategoriaNombre = (producto: ProductoData) => {
    if (producto.categoriaId) {
      const cat = categorias.find(c => String(c.id) === String(producto.categoriaId));
      if (cat) return cat.nombre;
    }
    if (producto.tallasDisponibles && producto.tallasDisponibles.length > 0) {
      const t = producto.tallasDisponibles[0] as any;
      if (t?.categoriaId && typeof t.categoriaId === 'object' && 'nombre' in t.categoriaId) return t.categoriaId.nombre;
    }
    return 'N/A';
  };

  const getTallasTexto = (producto: ProductoData) => {
    if (producto.tallasDisponibles && producto.tallasDisponibles.length > 0) {
      return producto.tallasDisponibles.map(t => typeof t === 'string' ? t : t.talla).join(', ');
    }
    if (producto.tallas && producto.tallas.length > 0) {
      return producto.tallas.map(t => t.talla).join(', ');
    }
    return null;
  };

  const renderProductItem = ({ item }: { item: ProductoData }) => (
    <TouchableOpacity
      style={[
        globalStyles.cardElevated,
        { width: (width - stylesGlobal.spacing.scale[6] * 3) / 2, marginBottom: stylesGlobal.spacing.scale[3] },
      ]}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.85}
    >
      <View style={{
        height: 150,
        backgroundColor: surfaceTertiary,
        borderRadius: parseInt(stylesGlobal.borders.radius.md),
        marginBottom: stylesGlobal.spacing.scale[2],
        overflow: 'hidden',
      }}>
        {item.imagenURL ? (
          <Image source={{ uri: item.imagenURL }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialIcons name="checkroom" size={40} color={textMuted} />
          </View>
        )}
      </View>

      <Text style={[globalStyles.listItemTitle, { marginBottom: stylesGlobal.spacing.scale[1] }]} numberOfLines={2}>
        {item.nombre}
      </Text>

      {item.tipoTela && (
        <Text style={[globalStyles.listItemSubtitle, { color: textSecondary, marginBottom: stylesGlobal.spacing.scale[1] }]}>
          {item.tipoTela}
        </Text>
      )}

      {item.disponible !== false && (
        <View style={{
          backgroundColor: stylesGlobal.colors.semantic.success.light as string,
          paddingHorizontal: stylesGlobal.spacing.scale[1],
          paddingVertical: 2,
          borderRadius: parseInt(stylesGlobal.borders.radius.sm),
          alignSelf: 'flex-start',
        }}>
          <Text style={[globalStyles.listItemSubtitle, { color: stylesGlobal.colors.semantic.success.dark }]}>
            Disponible
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderProductModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowModal(false)}
    >
      <SafeAreaView style={globalStyles.screenBase}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ padding: stylesGlobal.spacing.scale[4] }}>

            {/* Header del modal */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: stylesGlobal.spacing.scale[6] }}>
              <Text style={globalStyles.modalTitle}>Detalles del Producto</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={globalStyles.modalCloseButton}>
                <Ionicons name="close" size={24} color={textPrimary} />
              </TouchableOpacity>
            </View>

            {selectedProduct && (
              <>
                {/* Imagen */}
                <View style={{
                  height: 260,
                  backgroundColor: surfaceTertiary,
                  borderRadius: parseInt(stylesGlobal.borders.radius.lg),
                  marginBottom: stylesGlobal.spacing.scale[6],
                  overflow: 'hidden',
                }}>
                  {selectedProduct.imagenURL ? (
                    <Image source={{ uri: selectedProduct.imagenURL }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                  ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <MaterialIcons name="checkroom" size={64} color={textMuted} />
                      <Text style={{ color: textMuted, fontSize: 13, marginTop: 8 }}>Sin imagen</Text>
                    </View>
                  )}
                </View>

                {/* Nombre y estado */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: stylesGlobal.spacing.scale[4] }}>
                  <Text style={[globalStyles.listItemTitle, { flex: 1, fontSize: 20, marginRight: 8 }]}>
                    {selectedProduct.nombre}
                  </Text>
                  <View style={{
                    backgroundColor: selectedProduct.disponible !== false
                      ? stylesGlobal.colors.semantic.success.light as string
                      : stylesGlobal.colors.semantic.error.light as string,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: selectedProduct.disponible !== false
                        ? stylesGlobal.colors.semantic.success.dark as string
                        : stylesGlobal.colors.semantic.error.dark as string,
                    }}>
                      {selectedProduct.disponible !== false ? 'Disponible' : 'No disponible'}
                    </Text>
                  </View>
                </View>

                {/* Detalles en filas */}
                <View style={{
                  backgroundColor: surfaceSecondary,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: stylesGlobal.spacing.scale[4],
                  gap: 12,
                }}>
                  {selectedProduct.tipoTela && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <MaterialIcons name="texture" size={18} color={primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 11, color: textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Tipo de tela</Text>
                        <Text style={{ fontSize: 14, color: textPrimary, fontWeight: '500', marginTop: 1 }}>{selectedProduct.tipoTela}</Text>
                      </View>
                    </View>
                  )}

                  {getTallasTexto(selectedProduct) && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <MaterialIcons name="straighten" size={18} color={primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 11, color: textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Tallas disponibles</Text>
                        <Text style={{ fontSize: 14, color: textPrimary, fontWeight: '500', marginTop: 1 }}>{getTallasTexto(selectedProduct)}</Text>
                      </View>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <MaterialIcons name="place" size={18} color={primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, color: textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Localidad</Text>
                      <Text style={{ fontSize: 14, color: textPrimary, fontWeight: '500', marginTop: 1 }}>{getLocalidadNombre(selectedProduct)}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <MaterialIcons name="category" size={18} color={primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, color: textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Categoría</Text>
                      <Text style={{ fontSize: 14, color: textPrimary, fontWeight: '500', marginTop: 1 }}>{getCategoriaNombre(selectedProduct)}</Text>
                    </View>
                  </View>
                </View>

                {/* Descripción */}
                {selectedProduct.descripcion && (
                  <View style={{ marginBottom: stylesGlobal.spacing.scale[6] }}>
                    <Text style={{ fontSize: 13, color: textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                      Descripción
                    </Text>
                    <Text style={{ fontSize: 14, color: textSecondary, lineHeight: 22 }}>
                      {selectedProduct.descripcion}
                    </Text>
                  </View>
                )}

                {/* Botón WhatsApp */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#25D366',
                    borderRadius: 12,
                    paddingVertical: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    marginBottom: stylesGlobal.spacing.scale[4],
                  }}
                  onPress={() => handleContactWhatsApp(selectedProduct)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="logo-whatsapp" size={22} color="#fff" />
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                    Contactar por WhatsApp
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.screenCentered}>
        <ActivityIndicator size="large" color={primary} />
        <Text style={[globalStyles.listItemSubtitle, { marginTop: stylesGlobal.spacing.scale[3], color: textMuted }]}>
          Cargando productos...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.screenBase}>
      <>
        <View style={{ padding: stylesGlobal.spacing.scale[4], marginTop: stylesGlobal.spacing.scale[1] }}>
          <Text style={[globalStyles.headerTitle, { marginBottom: stylesGlobal.spacing.scale[6] }]}>
            Productos
          </Text>

          <View style={{ marginBottom: stylesGlobal.spacing.scale[3] }}>
            {/* Buscador */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: surfaceSecondary,
              borderRadius: parseInt(stylesGlobal.borders.radius.md),
              paddingHorizontal: stylesGlobal.spacing.scale[3],
              paddingVertical: stylesGlobal.spacing.scale[4],
              marginBottom: stylesGlobal.spacing.scale[2],
              minHeight: 48,
            }}>
              <TextInput
                style={[globalStyles.inputBase, {
                  flex: 1,
                  marginLeft: 0,
                  paddingVertical: stylesGlobal.spacing.scale[2],
                  color: textPrimary,
                  fontSize: 15,
                  fontWeight: '500',
                  minHeight: 36,
                  backgroundColor: 'transparent',
                }]}
                placeholder="Buscar productos..."
                placeholderTextColor={textMuted}
                value={searchQuery}
                onChangeText={text => { setSearchQuery(text); setSearchTriggered(false); }}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={() => { setSearchTriggered(true); filterProductos(); }}
                style={{
                  marginLeft: stylesGlobal.spacing.scale[2],
                  backgroundColor: primary,
                  borderRadius: parseInt(stylesGlobal.borders.radius.sm),
                  padding: 8,
                }}
                accessibilityLabel="Buscar"
              >
                <Ionicons name="search" size={20} color="#fff" />
              </TouchableOpacity>
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginLeft: stylesGlobal.spacing.scale[1] }}>
                  <Ionicons name="close-circle" size={20} color={textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filtros desplegables */}
            <View style={{ marginBottom: stylesGlobal.spacing.scale[2] }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: surfaceTertiary,
                  borderRadius: parseInt(stylesGlobal.borders.radius.md),
                  paddingHorizontal: stylesGlobal.spacing.scale[3],
                  paddingVertical: stylesGlobal.spacing.scale[2],
                }}
                onPress={() => setShowFilters(prev => !prev)}
              >
                <Ionicons name={showFilters ? 'chevron-up' : 'chevron-down'} size={20} color={textPrimary} />
                <Text style={[globalStyles.listItemTitle, { marginLeft: stylesGlobal.spacing.scale[2] }]}>Filtros</Text>
              </TouchableOpacity>

              {showFilters && (
                <View style={{ marginTop: stylesGlobal.spacing.scale[4], paddingHorizontal: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: textSecondary, marginBottom: 8, marginTop: 8 }}>
                    Filtrar por Talla
                  </Text>
                  <Picker
                    selectedValue={selectedTalla ?? undefined}
                    onValueChange={(value: string) => setSelectedTalla(value === '' ? null : value)}
                    style={{ height: 52, marginBottom: 16 }}
                  >
                    <Picker.Item label="Todas las tallas" value="" />
                    {tallasUnicas.map(talla => <Picker.Item key={talla} label={talla} value={talla} />)}
                  </Picker>

                  <Text style={{ fontSize: 14, fontWeight: '600', color: textSecondary, marginBottom: 8 }}>
                    Filtrar por Localidad
                  </Text>
                  <Picker
                    selectedValue={selectedLocalidad ?? undefined}
                    onValueChange={(value: string) => setSelectedLocalidad(value === '' ? null : value)}
                    style={{ height: 52, marginBottom: 16 }}
                  >
                    <Picker.Item label="Todas las localidades" value="" />
                    {localidadesUnicas.map(([id, nombre]) => <Picker.Item key={id} label={nombre} value={id} />)}
                  </Picker>
                </View>
              )}
            </View>
          </View>

          {/* Botón quitar filtro de localidad */}
          {localidadParam && selectedLocalidad && (
            <TouchableOpacity
              style={{
                backgroundColor: stylesGlobal.colors.secondary[500] as string,
                padding: 10,
                borderRadius: 8,
                marginBottom: 12,
                alignSelf: 'flex-start',
              }}
              onPress={() => setSelectedLocalidad(null)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Quitar filtro de localidad</Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={filteredProductos}
            renderItem={renderProductItem}
            keyExtractor={(item, index) => item._id ?? item.id ?? `product-${index}`}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[primary]}
              />
            }
            ListEmptyComponent={
              <View style={[globalStyles.screenCentered, { paddingTop: 60 }]}>
                <MaterialIcons name="checkroom" size={60} color={textMuted} />
                <Text style={[globalStyles.listItemTitle, { marginTop: stylesGlobal.spacing.scale[3], color: textMuted, textAlign: 'center' }]}>
                  {searchQuery ? 'No se encontraron productos' : 'No hay productos disponibles'}
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: stylesGlobal.spacing.scale[24] }}
          />
        </View>

        {renderProductModal()}
      </>
    </SafeAreaView>
  );
};

export default ProductosScreen;