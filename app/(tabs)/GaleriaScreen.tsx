import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { setAudioModeAsync } from 'expo-audio';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import { Hero } from '../../components/ui/Hero';
import { publicAPI } from '../../services/api';

type Photo = {
  _id?: string;
  url: string;
  titulo: string;
  descripcion?: string;
  eventoId?: any;
  fechaSubida?: string;
};

type Video = {
  _id?: string;
  url: string;
  titulo: string;
  descripcion?: string;
  miniatura?: string;
  duracion?: number;
  eventoId?: any;
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
};

type MediaItem = (Photo | Video) & { tipo: 'foto' | 'video' };

// ─── Constantes de marca ──────────────────────────────────────────────────────
const PRIMARY = '#d63384';
const ACCENT = '#e6a756';
const SAGE = '#6b9b6b';
const BG = '#faf6ee';
const SURFACE = '#ffffff';
const TEXT_DARK = '#2a241f';
const TEXT_MUTED = '#8b7d74';
const BORDER = '#ede9e6';
const WHATSAPP_FALLBACK = '527711234567';

// ─── VideoPlayer ────────────────────────────────────────────────────────────
const VideoPlayer: React.FC<{ uri: string; style?: any }> = ({ uri, style }) => {
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
      contentFit="contain"
      style={[{ width: '100%', height: 220, backgroundColor: '#000' }, style]}
    />
  );
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const idDe = (ref: any): string | null => (ref && typeof ref === 'object' ? ref._id : ref) || null;

const formatFecha = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha por confirmar';

// ─── Componente principal ─────────────────────────────────────────────────────
const GaleriaScreen: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [fotos, setFotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(WHATSAPP_FALLBACK);

  // Lightbox de fotos (con navegación dentro de un grupo)
  const [currentFotos, setCurrentFotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageVisible, setImageVisible] = useState(false);
  // Reproductor de video
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const [ev, fo, vi] = await Promise.all([
          publicAPI.getEventos(),
          publicAPI.getFotos(),
          publicAPI.getVideos(),
        ]);
        setEventos(Array.isArray(ev) ? (ev as any) : []);
        setFotos(Array.isArray(fo) ? (fo as any) : []);
        setVideos(Array.isArray(vi) ? (vi as any) : []);
      } catch (err: any) {
        setError(err?.error || 'Error al cargar la galería');
      } finally {
        setLoading(false);
      }
      // WhatsApp desde la configuración del sitio (no bloquea)
      try {
        const config = await publicAPI.getConfiguracion();
        const digits = String(config?.redesSociales?.whatsapp || '').replace(/\D/g, '');
        if (digits) setWhatsappNumber(digits);
      } catch {
        // se mantiene el fallback
      }
    };
    cargar();
  }, []);

  const { width, height: screenH } = Dimensions.get('window');

  // Eventos próximos / pasados
  const { proximos, pasados } = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const esFuturo = (e: Evento) => !!e.fecha && new Date(e.fecha) >= hoy;
    const prox = eventos.filter(esFuturo).sort((a, b) => +new Date(a.fecha!) - +new Date(b.fecha!));
    const pas = eventos.filter((e) => !esFuturo(e)).sort((a, b) => +new Date(b.fecha!) - +new Date(a.fecha!));
    return { proximos: prox, pasados: pas };
  }, [eventos]);

  const mediaDeEvento = (eventoId?: string): MediaItem[] => {
    if (!eventoId) return [];
    const f = fotos.filter((x) => idDe(x.eventoId) === eventoId).map((x) => ({ ...x, tipo: 'foto' as const }));
    const v = videos.filter((x) => idDe(x.eventoId) === eventoId).map((x) => ({ ...x, tipo: 'video' as const }));
    return [...f, ...v];
  };

  // Media SIN evento (galería general)
  const fotosGenerales = useMemo(() => fotos.filter((f) => !idDe(f.eventoId)), [fotos]);
  const videosGenerales = useMemo(() => videos.filter((v) => !idDe(v.eventoId)), [videos]);

  // ── WhatsApp ──
  const abrirWhatsApp = (mensaje: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'No se pudo abrir WhatsApp.'));
  };

  // ── Lightbox ──
  const openImage = (grupo: Photo[], index: number) => {
    setCurrentFotos(grupo);
    setCurrentIndex(index);
    setImageVisible(true);
  };
  const navImage = (dir: 'next' | 'prev') => {
    if (!currentFotos.length) return;
    let i = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (i < 0) i = currentFotos.length - 1;
    if (i >= currentFotos.length) i = 0;
    setCurrentIndex(i);
  };
  const fotoActual = currentFotos[currentIndex];

  // ── Estilos derivados ──
  const cardMargin = 12;
  const thumbSize = (width - cardMargin * 2 - 32 - 16) / 3; // ancho card - paddings - gaps
  const genThumbW = (width - cardMargin * 3) / 2;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <AppText variant="bodyMuted" style={{ marginTop: 12 }}>Cargando galería...</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Hero
          eyebrow="Eventos y cultura huasteca"
          title="Galería"
          subtitle="Revive nuestras ferias y celebraciones, o súmate al próximo evento."
        />

        {error ? (
          <View style={{ alignItems: 'center', padding: 32 }}>
            <MaterialIcons name="error-outline" size={40} color={TEXT_MUTED} />
            <AppText variant="bodyMuted" style={{ marginTop: 8, textAlign: 'center' }}>{error}</AppText>
          </View>
        ) : null}

        {/* ── PRÓXIMOS EVENTOS ── */}
        <AppText variant="h2" style={{ marginHorizontal: cardMargin, marginTop: 20, marginBottom: 4 }}>
          Próximos eventos
        </AppText>
        {proximos.length > 0 ? (
          proximos.map((ev) => (
            <View
              key={ev._id}
              style={{
                backgroundColor: SURFACE, borderRadius: 16, borderWidth: 1, borderColor: BORDER,
                marginHorizontal: cardMargin, marginTop: 12, padding: 16,
                shadowColor: TEXT_DARK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <MaterialIcons name="event" size={16} color={PRIMARY} />
                <Text style={{ color: PRIMARY, fontWeight: '600', fontSize: 13 }}>{formatFecha(ev.fecha)}</Text>
              </View>
              <AppText variant="h2" style={{ fontSize: 18, lineHeight: 24, color: TEXT_DARK, marginBottom: 4 }}>
                {ev.titulo || 'Evento especial'}
              </AppText>
              {ev.ubicacion ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <MaterialIcons name="place" size={14} color={TEXT_MUTED} />
                  <Text style={{ color: TEXT_MUTED, fontSize: 13 }}>{ev.ubicacion}</Text>
                </View>
              ) : null}
              {ev.descripcion ? (
                <AppText variant="body" style={{ fontSize: 14, marginBottom: 12 }}>{ev.descripcion}</AppText>
              ) : null}
              <TouchableOpacity
                onPress={() => abrirWhatsApp(`Hola, me interesa asistir al evento *${ev.titulo}*. ¿Me dan más información?`)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-whatsapp" size={16} color={SAGE} />
                <Text style={{ color: PRIMARY, fontWeight: '700', fontSize: 14 }}>Escríbenos para asistir →</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 28, paddingHorizontal: cardMargin }}>
            <MaterialIcons name="event-available" size={40} color={BORDER} />
            <AppText variant="bodyStrong" style={{ marginTop: 8 }}>Próximamente</AppText>
            <AppText variant="bodyMuted" style={{ textAlign: 'center' }}>Estamos preparando nuevos eventos. ¡Mantente atento!</AppText>
          </View>
        )}

        {/* ── REVIVE NUESTROS EVENTOS (pasados con galería) ── */}
        {pasados.length > 0 && (
          <>
            <AppText variant="h2" style={{ marginHorizontal: cardMargin, marginTop: 28, marginBottom: 4 }}>
              Revive nuestros eventos
            </AppText>
            <AppText variant="bodyMuted" style={{ marginHorizontal: cardMargin, marginBottom: 8 }}>
              Toca cualquier foto o video para verlo en grande.
            </AppText>
            {pasados.map((ev) => {
              const media = mediaDeEvento(ev._id);
              const fotosEvento = media.filter((m) => m.tipo === 'foto') as Photo[];
              return (
                <View
                  key={ev._id}
                  style={{
                    backgroundColor: SURFACE, borderRadius: 16, borderWidth: 1, borderColor: BORDER,
                    marginHorizontal: cardMargin, marginTop: 12, overflow: 'hidden',
                    shadowColor: TEXT_DARK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
                  }}
                >
                  <View style={{ padding: 16 }}>
                    <View style={{
                      alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4,
                      backgroundColor: '#e8f0e8', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8,
                    }}>
                      <MaterialIcons name="check-circle" size={12} color={SAGE} />
                      <Text style={{ color: SAGE, fontWeight: '600', fontSize: 11 }}>Evento realizado</Text>
                    </View>
                    <Text style={{ color: TEXT_MUTED, fontSize: 12, fontWeight: '600', marginBottom: 2 }}>{formatFecha(ev.fecha)}</Text>
                    <AppText variant="h2" style={{ fontSize: 18, lineHeight: 24, color: TEXT_DARK, marginBottom: 4 }}>
                      {ev.titulo || 'Evento'}
                    </AppText>
                    {ev.ubicacion ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <MaterialIcons name="place" size={14} color={TEXT_MUTED} />
                        <Text style={{ color: TEXT_MUTED, fontSize: 13 }}>{ev.ubicacion}</Text>
                      </View>
                    ) : null}
                    {ev.descripcion ? (
                      <AppText variant="body" style={{ fontSize: 14 }}>{ev.descripcion}</AppText>
                    ) : null}
                  </View>

                  {media.length > 0 ? (
                    <View style={{
                      flexDirection: 'row', flexWrap: 'wrap', gap: 8,
                      padding: 12, paddingTop: 0, backgroundColor: SURFACE,
                    }}>
                      {media.slice(0, 6).map((m, i) => {
                        const last = i === 5 && media.length > 6;
                        const restantes = media.length - 6;
                        if (m.tipo === 'video') {
                          const vid = m as Video;
                          return (
                            <TouchableOpacity
                              key={m._id}
                              onPress={() => setSelectedVideo(vid)}
                              activeOpacity={0.85}
                              style={{ width: thumbSize, height: thumbSize, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fce7eb' }}
                            >
                              {vid.miniatura ? (
                                <Image source={{ uri: vid.miniatura }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                              ) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                  <MaterialIcons name="videocam" size={28} color={ACCENT} />
                                </View>
                              )}
                              <View style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center' }}>
                                  <Ionicons name="play" size={16} color="#fff" style={{ marginLeft: 2 }} />
                                </View>
                              </View>
                              {last && (
                                <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(42,36,31,0.62)', justifyContent: 'center', alignItems: 'center' }}>
                                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>+{restantes}</Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          );
                        }
                        const foto = m as Photo;
                        const fi = fotosEvento.findIndex((f) => f._id === foto._id);
                        return (
                          <TouchableOpacity
                            key={m._id}
                            onPress={() => openImage(fotosEvento, fi < 0 ? 0 : fi)}
                            activeOpacity={0.85}
                            style={{ width: thumbSize, height: thumbSize, borderRadius: 10, overflow: 'hidden', backgroundColor: '#f7f6f4' }}
                          >
                            <Image source={{ uri: foto.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                            {last && (
                              <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(42,36,31,0.62)', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>+{restantes}</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={{ padding: 16, paddingTop: 0 }}>
                      <Text style={{ color: TEXT_MUTED, fontStyle: 'italic', fontSize: 13 }}>Galería próximamente</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* ── GALERÍA GENERAL (sin evento) ── */}
        {(videosGenerales.length > 0 || fotosGenerales.length > 0) && (
          <>
            <AppText variant="h2" style={{ marginHorizontal: cardMargin, marginTop: 28, marginBottom: 8 }}>
              Galería
            </AppText>

            {videosGenerales.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: cardMargin, paddingBottom: 8, gap: 12 }}
              >
                {videosGenerales.map((video) => (
                  <TouchableOpacity
                    key={video._id}
                    onPress={() => setSelectedVideo(video)}
                    activeOpacity={0.88}
                    style={{ width: 160, borderRadius: 14, overflow: 'hidden', backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER }}
                  >
                    <View style={{ width: 160, height: 160, backgroundColor: '#fce7eb', justifyContent: 'center', alignItems: 'center' }}>
                      {video.miniatura ? (
                        <Image source={{ uri: video.miniatura }} style={{ width: 160, height: 160 }} resizeMode="cover" />
                      ) : (
                        <MaterialIcons name="videocam" size={40} color={ACCENT} />
                      )}
                      <View style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}>
                          <Ionicons name="play" size={18} color="#fff" style={{ marginLeft: 2 }} />
                        </View>
                      </View>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: TEXT_DARK }} numberOfLines={1}>{video.titulo}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {fotosGenerales.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: cardMargin, marginHorizontal: cardMargin, marginTop: 4 }}>
                {fotosGenerales.map((foto) => (
                  <TouchableOpacity
                    key={foto._id}
                    onPress={() => openImage(fotosGenerales, fotosGenerales.findIndex((f) => f._id === foto._id))}
                    activeOpacity={0.88}
                    style={{ width: genThumbW, borderRadius: 14, overflow: 'hidden', backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, marginBottom: 0 }}
                  >
                    <Image source={{ uri: foto.url }} style={{ width: genThumbW, height: genThumbW * 0.85 }} resizeMode="cover" />
                    <View style={{ padding: 8 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: TEXT_DARK }} numberOfLines={1}>{foto.titulo}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* ── CTA FINAL ── */}
        <View style={{ backgroundColor: PRIMARY, borderRadius: 20, padding: 24, margin: cardMargin, marginTop: 28, alignItems: 'center' }}>
          <AppText variant="h2" style={{ color: '#fff', textAlign: 'center', marginBottom: 6 }}>
            ¿Quieres que estemos en tu evento?
          </AppText>
          <Text style={{ color: 'rgba(255,255,255,0.92)', textAlign: 'center', fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
            Llevamos nuestra artesanía a ferias, festivales y celebraciones. Escríbenos y lo organizamos.
          </Text>
          <TouchableOpacity
            onPress={() => abrirWhatsApp('Hola, me gustaría que La Aterciopelada participe en un evento. ¿Me dan información?')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 999, paddingVertical: 12, paddingHorizontal: 24 }}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-whatsapp" size={18} color={SAGE} />
            <Text style={{ color: PRIMARY, fontWeight: '700', fontSize: 15 }}>Escríbenos por WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Lightbox de foto ── */}
      <Modal visible={imageVisible} transparent animationType="fade" onRequestClose={() => setImageVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
          <Pressable
            onPress={() => setImageVisible(false)}
            style={{ position: 'absolute', top: 52, right: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 8 }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>

          {currentFotos.length > 1 && (
            <>
              <Pressable
                onPress={() => navImage('prev')}
                style={{ position: 'absolute', left: 12, top: '50%', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 24, padding: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </Pressable>
              <Pressable
                onPress={() => navImage('next')}
                style={{ position: 'absolute', right: 12, top: '50%', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 24, padding: 10 }}
              >
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </Pressable>
            </>
          )}

          {fotoActual?.url ? (
            <Image source={{ uri: fotoActual.url }} style={{ width: width - 32, height: width - 32, borderRadius: 16 }} resizeMode="contain" />
          ) : null}

          {fotoActual?.titulo ? (
            <View style={{ marginTop: 20, paddingHorizontal: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' }}>{fotoActual.titulo}</Text>
              {fotoActual.descripcion ? (
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 6, lineHeight: 20 }}>{fotoActual.descripcion}</Text>
              ) : null}
              {currentFotos.length > 1 ? (
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 10 }}>{currentIndex + 1} / {currentFotos.length}</Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </Modal>

      {/* ── Reproductor de video (pantalla completa inmersiva) ── */}
      <Modal visible={!!selectedVideo} transparent animationType="fade" onRequestClose={() => setSelectedVideo(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.96)', justifyContent: 'center', alignItems: 'center' }}>
          <Pressable
            onPress={() => setSelectedVideo(null)}
            style={{ position: 'absolute', top: 52, right: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 8 }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>

          {selectedVideo?.url ? (
            <VideoPlayer
              uri={selectedVideo.url}
              style={{ width, height: screenH * 0.6, backgroundColor: 'transparent' }}
            />
          ) : null}

          {selectedVideo?.titulo ? (
            <View style={{ marginTop: 20, paddingHorizontal: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' }}>{selectedVideo.titulo}</Text>
              {selectedVideo.descripcion ? (
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
                  {selectedVideo.descripcion}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GaleriaScreen;
