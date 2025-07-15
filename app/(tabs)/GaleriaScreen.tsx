import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { publicAPI } from '../../services/api';

// Tipo para foto según modelo backend
type Photo = {
  _id?: string;
  url: string;
  titulo: string;
  descripcion?: string;
  fechaSubida?: string;
};

// Interfaz para videos/reels según modelo backend
type Video = {
  _id?: string;
  url: string;
  titulo: string;
  descripcion?: string;
  publicId?: string;
  duracion?: number;
  formato?: string;
  miniatura?: string;
  miniaturaPublicId?: string;
  fechaSubida?: string;
};

// Estado para fotos de la API
const GaleriaScreen: React.FC = () => {
  const [photosData, setPhotosData] = useState<Photo[]>([]);
  const [videosData, setVideosData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorVideos, setErrorVideos] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await publicAPI.getFotos();
        // La API retorna un array directamente
        if (Array.isArray(response)) {
          setPhotosData(response);
        } else {
          setPhotosData([]);
        }
      } catch (err: any) {
        setError(err?.error || 'Error al cargar fotos');
      } finally {
        setLoading(false);
      }
    };
    fetchFotos();
    const fetchVideos = async () => {
      try {
        const response = await publicAPI.getVideos();
        if (Array.isArray(response)) {
          setVideosData(response);
        } else {
          setVideosData([]);
        }
      } catch (err: any) {
        setErrorVideos(err?.error || 'Error al cargar videos');
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  // Obtener dimensiones de pantalla y calcular columnas
  const { width } = Dimensions.get('window');
  const numColumns = 2; // Siempre dos columnas en la sección de fotos
  const cardMargin = 12;
  const cardWidth = (width - (numColumns + 1) * cardMargin) / numColumns;

  // Dividir fotos en columnas
  const columns: Photo[][] = Array.from({ length: numColumns }, () => []);
  photosData.forEach((photo, index) => {
    columns[index % numColumns].push(photo);
  });

  // Estilos inyectados directamente
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fefcf3', // Fondo cálido
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#2a241f',
      marginVertical: 12,
      marginHorizontal: cardMargin,
    },
    reelScroll: {
      paddingHorizontal: cardMargin,
      paddingBottom: 12,
      backgroundColor: '#fdf2f4', // Fondo para sección de reels
    },
    reelCard: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 12,
      marginRight: 12,
      width: 180, // Ancho fijo para tarjetas
      height: 240, // Altura optimizada para reels
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reelIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#fce7eb',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    reelIcon: {
      fontSize: 48,
      color: '#d63384',
    },
    reelTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#2a241f',
      textAlign: 'center',
      marginBottom: 8,
    },
    reelDescription: {
      fontSize: 12,
      color: '#8b7d74',
      textAlign: 'center',
      lineHeight: 18,
    },
    photoContainer: {
      backgroundColor: '#f7f6f4', // Fondo para sección de fotos
      paddingTop: 12,
      paddingBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: cardMargin,
    },
    column: {
      flex: 1,
      marginRight: cardMargin,
    },
    lastColumn: {
      flex: 1,
      marginRight: 0,
    },
    photoCard: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 12,
      marginBottom: cardMargin,
      shadowColor: '#2a241f',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2,
      alignItems: 'center',
    },
    photoIconContainer: {
      width: cardWidth - 24, // Ajustar al ancho de la tarjeta
      height: (cardWidth - 24) * 1.2, // Proporción ajustada para imágenes
      borderRadius: 12,
      backgroundColor: '#fef7e0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    photoIcon: {
      fontSize: 40,
      color: '#e6a756',
    },
    photoTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#2a241f',
      textAlign: 'center',
      marginBottom: 4,
    },
    photoDescription: {
      fontSize: 12,
      color: '#8b7d74',
      textAlign: 'center',
      lineHeight: 18,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Sección de Reels Destacados (ahora funcional con videos de la API) */}
        <Text style={styles.sectionTitle}>Reels Destacados</Text>
        {loadingVideos ? (
          <ActivityIndicator size="large" color="#d63384" style={{ marginTop: 32 }} />
        ) : errorVideos ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 32 }}>{errorVideos}</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.reelScroll}
            snapToInterval={192}
            decelerationRate="fast"
          >
            {videosData.map((video) => (
              <TouchableOpacity
                key={video._id}
                style={styles.reelCard}
                onPress={() => {
                  setSelectedVideo(video);
                  setVideoModalVisible(true);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.reelIconContainer}>
                  {video.miniatura ? (
                    <Image source={{ uri: video.miniatura }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                  ) : (
                    <Text style={styles.reelIcon}>▶️</Text>
                  )}
                </View>
                <Text style={styles.reelTitle}>{video.titulo}</Text>
                <Text style={styles.reelDescription}>{video.descripcion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Sección de Fotos (Masonry Layout) */}
        <Text style={styles.sectionTitle}>Galería de Fotos</Text>
        <View style={styles.photoContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#e6a756" style={{ marginTop: 32 }} />
          ) : error ? (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 32 }}>{error}</Text>
          ) : (
            columns.map((column, index) => (
              <View
                key={`column-${index}`}
                style={index === numColumns - 1 ? styles.lastColumn : styles.column}
              >
                {column.map((photo) => (
                <TouchableOpacity
                  key={photo._id}
                  style={[styles.photoCard, { width: cardWidth }]}
                  onPress={() => {
                    setSelectedPhoto(photo);
                    setModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.photoIconContainer,
                      { height: cardWidth * 0.6, width: cardWidth - 24 },
                    ]}
                  >
                    {/* Imagen real */}
                    <Image source={{ uri: photo.url }} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
                  </View>
                  <Text style={styles.photoTitle}>{photo.titulo}</Text>
                  <Text style={styles.photoDescription}>{photo.descripcion}</Text>
                </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {/* Modal para ver imagen en grande */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', maxWidth: '90%' }}>
            {selectedPhoto?.url && (
              <Image
                source={{ uri: selectedPhoto.url }}
                style={{ width: 300, height: 300, borderRadius: 12, marginBottom: 16 }}
                resizeMode="cover"
              />
            )}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2a241f', marginBottom: 8, textAlign: 'center' }}>{selectedPhoto?.titulo}</Text>
            <Text style={{ fontSize: 14, color: '#8b7d74', textAlign: 'center', marginBottom: 16 }}>{selectedPhoto?.descripcion}</Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{ backgroundColor: '#e6a756', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Modal para reproducir video */}
      <Modal
        visible={videoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', maxWidth: '90%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2a241f', marginBottom: 8, textAlign: 'center' }}>{selectedVideo?.titulo}</Text>
            <Text style={{ fontSize: 14, color: '#8b7d74', textAlign: 'center', marginBottom: 16 }}>{selectedVideo?.descripcion}</Text>
            {selectedVideo?.url && (
              <ExpoVideo
                source={{ uri: selectedVideo.url }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                useNativeControls
                style={{ width: 320, height: 200, borderRadius: 12, marginBottom: 16, backgroundColor: '#000' }}
              />
            )}
            <Pressable
              onPress={() => setVideoModalVisible(false)}
              style={{ backgroundColor: '#d63384', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


export default GaleriaScreen;