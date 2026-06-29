import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { publicAPI } from '../../services/api';
import { AppText } from '../../components/ui/AppText';
import { Hero } from '../../components/ui/Hero';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

const beneficiosData: { id: string; titulo: string; descripcion: string; icono: MaterialIconName }[] = [
  {
    id: "calidad",
    titulo: "Excelencia Artesanal",
    descripcion: "Cada pieza es meticulosamente elaborada por maestras artesanas con décadas de experiencia, garantizando la más alta calidad.",
    icono: "star",
  },
  {
    id: "autenticidad",
    titulo: "Herencia Cultural",
    descripcion: "Preservamos técnicas ancestrales huastecas, manteniendo viva la tradición textil de nuestros pueblos originarios.",
    icono: "eco",
  },
  {
    id: "artesanos",
    titulo: "Comercio Justo",
    descripcion: "Trabajamos directamente con comunidades artesanales, asegurando condiciones dignas y precios justos.",
    icono: "handshake",
  },
  {
    id: "exclusividad",
    titulo: "Piezas Únicas",
    descripcion: "Cada creación es irrepetible, diseñada especialmente para quienes valoran la autenticidad y la exclusividad.",
    icono: "diamond",
  },
];

interface Servicio {
  _id?: string;
  id?: string;
  nombre: string;
  titulo?: string;
  descripcion: string;
  imagen?: string;
  icono?: string;
}

const ArtisanServicesScreen = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await publicAPI.getServicios();
        const arr = Array.isArray(response) ? response : response.data ?? [];
        setServicios(arr.map((serv: any) => ({
          ...serv,
          id: serv._id ? String(serv._id) : (serv.id ? String(serv.id) : undefined)
        })));
      } catch {
        setServicios([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fefcf3',
    },

    sectionTitle: {
      marginVertical: 12,
      marginHorizontal: isSmallScreen ? 12 : 16,
    },
    serviceScroll: {
      paddingHorizontal: isSmallScreen ? 12 : 16,
      paddingBottom: 12,
    },
    serviceCard: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 16,
      marginRight: 12,
      width: 200,
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      alignItems: 'center',
      borderTopWidth: 3,
      borderTopColor: '#d63384',
    },
    serviceIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#fce7eb',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    serviceTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#2a241f',
      textAlign: 'center',
      marginBottom: 6,
      letterSpacing: 0.1,
    },
    serviceDescription: {
      fontSize: 12,
      color: '#8b7d74',
      textAlign: 'center',
      lineHeight: 18,
    },

    // Beneficios con MaterialIcons
    benefitContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: isSmallScreen ? 12 : 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#ede9e6',
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    benefitIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#fef7e0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
      flexShrink: 0,
    },
    benefitContent: {
      flex: 1,
    },
    benefitTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#2a241f',
      marginBottom: 4,
      letterSpacing: 0.1,
    },
    benefitDescription: {
      fontSize: 13,
      color: '#8b7d74',
      lineHeight: 19,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero tipográfico */}
        <Hero
          eyebrow="La Aterciopelada"
          title="Artesanía Huasteca"
          subtitle="Explora la belleza de nuestras tradiciones textiles"
        />

        {/* Servicios */}
        <AppText variant="h2" style={styles.sectionTitle}>Nuestros Servicios</AppText>
        {loading ? (
          <Text style={{ textAlign: 'center', marginVertical: 16, color: '#8b7d74' }}>
            Cargando servicios...
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.serviceScroll}
            snapToInterval={212}
            decelerationRate="fast"
          >
            {servicios.map((service) => (
              <TouchableOpacity
                key={service._id || service.id || service.nombre}
                style={styles.serviceCard}
                activeOpacity={0.85}
                onPress={() => {}}
              >
                {service.imagen ? (
                  <View style={styles.serviceIconContainer}>
                    <Image
                      source={{ uri: service.imagen }}
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <View style={styles.serviceIconContainer}>
                    <MaterialIcons name="checkroom" size={28} color="#d63384" />
                  </View>
                )}
                <Text style={styles.serviceTitle}>{service.titulo || service.nombre}</Text>
                <Text style={styles.serviceDescription}>{service.descripcion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Por Qué Elegirnos */}
        <AppText variant="h2" style={styles.sectionTitle}>Por Qué Elegirnos</AppText>
        {beneficiosData.map((benefit) => (
          <View key={benefit.id} style={styles.benefitContainer}>
            <View style={styles.benefitIconCircle}>
              <MaterialIcons name={benefit.icono} size={22} color="#e6a756" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>{benefit.titulo}</Text>
              <Text style={styles.benefitDescription}>{benefit.descripcion}</Text>
            </View>
          </View>
        ))}

        {/* Espaciado inferior */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArtisanServicesScreen;