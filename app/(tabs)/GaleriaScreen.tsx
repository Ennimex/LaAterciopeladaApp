import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { setAudioModeAsync } from 'expo-audio';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { publicAPI } from '../../services/api';

type Photo = {
  _id?: string;
  url: string;
  titulo: string;
  descripcion?: string;
  fechaSubida?: string;
};

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

type Evento = {
  _id?: string;
  titulo: string;
  descripcion?: string;
  fecha?: string;
  ubicacion?: string;
  horaInicio?: string;
  horaFin?: string;
  fechaEliminacion?: string;
};

// ─── VideoPlayer ────────────────────────────────────────────────────────────
const VideoPlayer: React.FC<{ uri: string }> = ({ uri }) => {
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  const player = useVideoPlayer(uri, (p) => {
    p.volume = 1.0;
    p.muted = false;
    p.play();
  });

  return (
    <VideoView
      player={player}
      allowsFullscreen
      allowsPictureInPicture
      style={{ width: '100%', height: 220, borderRadius: 12, backgroundColor: '#000' }}
    />
  );
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (iso?: string) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDateShort = (iso?: string) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ─── Constants ──────────────────────────────────────────────────────────────
const PRIMARY = '#d63384';
const ACCENT = '#e6a756';
const BG = '#fefcf3';
const SURFACE = '#ffffff';
const TEXT_DARK = '#2a241f';
const TEXT_MID = '#524842';
const TEXT_MUTED = '#8b7d74';
const BORDER = '#ede9e6';

// ─── Main Component ─────────────────────────────────────────────────────────
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

  const [eventosModalVisible, setEventosModalVisible] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [errorEventos, setErrorEventos] = useState<string | null>(null);

  const handleOpenEventosModal = async () => {
    setEventosModalVisible(true);
    setLoadingEventos(true);
    setErrorEventos(null);
    try {
      const response = await publicAPI.getEventos();
      setEventos(Array.isArray(response) ? response : []);
    } catch (err: any) {
      setErrorEventos(err?.error || 'Error al cargar eventos');
    } finally {
      setLoadingEventos(false);
    }
  };

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await publicAPI.getFotos();
        setPhotosData(Array.isArray(response) ? response : []);
      } catch (err: any) {
        setError(err?.error || 'Error al cargar fotos');
      } finally {
        setLoading(false);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await publicAPI.getVideos();
        setVideosData(Array.isArray(response) ? response : []);
      } catch (err: any) {
        setErrorVideos(err?.error || 'Error al cargar videos');
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchFotos();
    fetchVideos();
  }, []);

  const { width } = Dimensions.get('window');
  const cardMargin = 12;
  const numColumns = 2;
  const cardWidth = (width - (numColumns + 1) * cardMargin) / numColumns;

  const columns: Photo[][] = Array.from({ length: numColumns }, () => []);
  photosData.forEach((photo, index) => columns[index % numColumns].push(photo));

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: TEXT_DARK,
      marginVertical: 12,
      marginHorizontal: cardMargin,
      letterSpacing: 0.2,
    },

    // ── Reels ──
    reelCard: {
      backgroundColor: SURFACE,
      borderRadius: 16,
      marginRight: 12,
      width: 180,
      overflow: 'hidden',
      shadowColor: TEXT_DARK,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    reelThumbnail: {
      width: 180,
      height: 180,
      backgroundColor: '#fce7eb',
      justifyContent: 'center',
      alignItems: 'center',
    },
    reelInfo: {
      padding: 10,
    },
    reelTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: TEXT_DARK,
      marginBottom: 3,
    },
    reelDescription: {
      fontSize: 11,
      color: TEXT_MUTED,
      lineHeight: 16,
    },

    // ── Fotos ──
    photoCard: {
      backgroundColor: SURFACE,
      borderRadius: 14,
      marginBottom: cardMargin,
      overflow: 'hidden',
      shadowColor: TEXT_DARK,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    photoImage: {
      width: cardWidth,
      height: cardWidth * 0.85,
    },
    photoInfo: {
      padding: 8,
    },
    photoTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: TEXT_DARK,
      marginBottom: 2,
    },
    photoDescription: {
      fontSize: 11,
      color: TEXT_MUTED,
      lineHeight: 15,
    },
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* Botón flotante eventos */}
      <View style={{ position: 'absolute', top: 44, right: 16, zIndex: 20 }}>
        <Pressable
          onPress={handleOpenEventosModal}
          style={{
            backgroundColor: SURFACE,
            borderRadius: 24,
            padding: 8,
            shadowColor: TEXT_DARK,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
            borderWidth: 1.5,
            borderColor: PRIMARY,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <MaterialCommunityIcons name="calendar-month" size={18} color={PRIMARY} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: PRIMARY }}>Eventos</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Reels ── */}
        <Text style={styles.sectionTitle}>Reels Destacados</Text>
        {loadingVideos ? (
          <ActivityIndicator size="large" color={PRIMARY} style={{ marginVertical: 24 }} />
        ) : errorVideos ? (
          <Text style={{ color: 'red', textAlign: 'center', margin: 16 }}>{errorVideos}</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: cardMargin, paddingBottom: 12 }}
            snapToInterval={192}
            decelerationRate="fast"
          >
            {videosData.map((video) => (
              <TouchableOpacity
                key={video._id}
                style={styles.reelCard}
                onPress={() => { setSelectedVideo(video); setVideoModalVisible(true); }}
                activeOpacity={0.88}
              >
                {/* Thumbnail */}
                <View style={styles.reelThumbnail}>
                  {video.miniatura ? (
                    <>
                      <Image source={{ uri: video.miniatura }} style={{ width: 180, height: 180 }} resizeMode="cover" />
                      {/* Play overlay */}
                      <View style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}>
                          <Ionicons name="play" size={22} color="#fff" style={{ marginLeft: 3 }} />
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      <MaterialIcons name="videocam" size={48} color={ACCENT} />
                      <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(230,167,86,0.15)', borderRadius: 20, padding: 6 }}>
                        <Ionicons name="play-circle" size={28} color={ACCENT} />
                      </View>
                    </>
                  )}
                  {/* Duración badge */}
                  {video.duracion && (
                    <View style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
                        {Math.floor(video.duracion / 60)}:{String(video.duracion % 60).padStart(2, '0')}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.reelInfo}>
                  <Text style={styles.reelTitle} numberOfLines={1}>{video.titulo}</Text>
                  <Text style={styles.reelDescription} numberOfLines={2}>{video.descripcion || 'Sin descripción'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Fotos ── */}
        <Text style={styles.sectionTitle}>Galería de Fotos</Text>
        {loading ? (
          <ActivityIndicator size="large" color={ACCENT} style={{ marginVertical: 24 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', margin: 16 }}>{error}</Text>
        ) : (
          <View style={{ flexDirection: 'row', marginHorizontal: cardMargin }}>
            {columns.map((column, colIndex) => (
              <View
                key={`col-${colIndex}`}
                style={{ flex: 1, marginRight: colIndex === numColumns - 1 ? 0 : cardMargin }}
              >
                {column.map((photo) => (
                  <TouchableOpacity
                    key={photo._id}
                    style={styles.photoCard}
                    onPress={() => { setSelectedPhoto(photo); setModalVisible(true); }}
                    activeOpacity={0.88}
                  >
                    <Image
                      source={{ uri: photo.url }}
                      style={styles.photoImage}
                      resizeMode="cover"
                    />
                    <View style={styles.photoInfo}>
                      <Text style={styles.photoTitle} numberOfLines={1}>{photo.titulo}</Text>
                      {photo.descripcion ? (
                        <Text style={styles.photoDescription} numberOfLines={2}>{photo.descripcion}</Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modal foto en grande ── */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' }}>
          {/* Botón cerrar */}
          <Pressable
            onPress={() => setModalVisible(false)}
            style={{ position: 'absolute', top: 52, right: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 8 }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>

          {selectedPhoto?.url && (
            <Image
              source={{ uri: selectedPhoto.url }}
              style={{ width: width - 32, height: width - 32, borderRadius: 16 }}
              resizeMode="contain"
            />
          )}

          {/* Info de la foto */}
          <View style={{ marginTop: 20, paddingHorizontal: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 6 }}>
              {selectedPhoto?.titulo}
            </Text>
            {selectedPhoto?.descripcion ? (
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20 }}>
                {selectedPhoto.descripcion}
              </Text>
            ) : null}
            {selectedPhoto?.fechaSubida ? (
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>
                {formatDate(selectedPhoto.fechaSubida)}
              </Text>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* ── Modal reproductor de video ── */}
      <Modal visible={videoModalVisible} transparent animationType="slide" onRequestClose={() => setVideoModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: SURFACE, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 }}>
            {/* Handle */}
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: BORDER, alignSelf: 'center', marginBottom: 16 }} />

            <Text style={{ fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 }} numberOfLines={2}>
              {selectedVideo?.titulo}
            </Text>
            {selectedVideo?.descripcion ? (
              <Text style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 16, lineHeight: 18 }}>
                {selectedVideo.descripcion}
              </Text>
            ) : <View style={{ marginBottom: 16 }} />}

            {selectedVideo?.url && <VideoPlayer uri={selectedVideo.url} />}

            <Pressable
              onPress={() => setVideoModalVisible(false)}
              style={{ marginTop: 16, backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 13, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Modal eventos ── */}
      <Modal visible={eventosModalVisible} transparent animationType="slide" onRequestClose={() => setEventosModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: SURFACE, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' }}>
            {/* Handle + header */}
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: BORDER }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: BORDER, marginBottom: 12 }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialCommunityIcons name="calendar-month" size={20} color={PRIMARY} />
                <Text style={{ fontSize: 18, fontWeight: '700', color: TEXT_DARK }}>Eventos</Text>
              </View>
            </View>

            {loadingEventos ? (
              <ActivityIndicator size="large" color={PRIMARY} style={{ margin: 40 }} />
            ) : errorEventos ? (
              <Text style={{ color: 'red', textAlign: 'center', margin: 24 }}>{errorEventos}</Text>
            ) : eventos.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 40 }}>
                <MaterialIcons name="event-busy" size={48} color={BORDER} />
                <Text style={{ color: TEXT_MUTED, marginTop: 12, fontSize: 15 }}>No hay eventos disponibles</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                {eventos.map((evento) => (
                  <View
                    key={evento._id}
                    style={{
                      backgroundColor: BG,
                      borderRadius: 14,
                      padding: 16,
                      marginBottom: 12,
                      borderLeftWidth: 3,
                      borderLeftColor: PRIMARY,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 }}>{evento.titulo}</Text>
                    {evento.descripcion ? (
                      <Text style={{ fontSize: 13, color: TEXT_MID, marginBottom: 10, lineHeight: 18 }}>{evento.descripcion}</Text>
                    ) : null}

                    <View style={{ gap: 4 }}>
                      {evento.fecha && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <MaterialIcons name="event" size={14} color={PRIMARY} />
                          <Text style={{ fontSize: 12, color: TEXT_MUTED }}>{formatDate(evento.fecha)}</Text>
                        </View>
                      )}
                      {evento.ubicacion && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <MaterialIcons name="place" size={14} color={PRIMARY} />
                          <Text style={{ fontSize: 12, color: TEXT_MUTED }}>{evento.ubicacion}</Text>
                        </View>
                      )}
                      {(evento.horaInicio || evento.horaFin) && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <MaterialIcons name="schedule" size={14} color={PRIMARY} />
                          <Text style={{ fontSize: 12, color: TEXT_MUTED }}>
                            {evento.horaInicio || ''}{evento.horaInicio && evento.horaFin ? ' – ' : ''}{evento.horaFin || ''}
                          </Text>
                        </View>
                      )}
                      {evento.fechaEliminacion && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <MaterialIcons name="info-outline" size={13} color={ACCENT} />
                          <Text style={{ fontSize: 11, color: ACCENT }}>Disponible hasta: {formatDateShort(evento.fechaEliminacion)}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            <Pressable
              onPress={() => setEventosModalVisible(false)}
              style={{ margin: 16, backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 13, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default GaleriaScreen;