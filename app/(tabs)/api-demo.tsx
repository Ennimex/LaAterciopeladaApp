import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importar servicios móviles (después de limpiar admin)
// import { 
//   productService, 
//   categoriaService, 
//   tallaService,
//   localidadService,
//   eventoService,
//   fotoService,
//   videoService,
//   servicioService,
//   nosotrosService,
//   colaboradorService,
//   profileService
// } from '../../services';

export default function ApiDemoScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');

  // Servicios disponibles para la app móvil
  const mobileServices = [
    { 
      key: 'products', 
      name: 'Productos', 
      description: 'Catálogo de productos de terciopelo',
      endpoints: ['/productos']
    },
    { 
      key: 'categories', 
      name: 'Categorías', 
      description: 'Categorías de productos',
      endpoints: ['/categorias']
    },
    { 
      key: 'sizes', 
      name: 'Tallas', 
      description: 'Tallas disponibles',
      endpoints: ['/tallas']
    },
    { 
      key: 'locations', 
      name: 'Localidades', 
      description: 'Ubicaciones de eventos',
      endpoints: ['/localidades']
    },
    { 
      key: 'events', 
      name: 'Eventos', 
      description: 'Eventos culturales públicos',
      endpoints: ['/eventos']
    },
    { 
      key: 'photos', 
      name: 'Fotos', 
      description: 'Galería de fotos',
      endpoints: ['/fotos']
    },
    { 
      key: 'videos', 
      name: 'Videos', 
      description: 'Videos promocionales',
      endpoints: ['/videos']
    },
    { 
      key: 'services', 
      name: 'Servicios', 
      description: 'Servicios ofrecidos',
      endpoints: ['/servicios']
    },
    { 
      key: 'about', 
      name: 'Nosotros', 
      description: 'Información de la empresa',
      endpoints: ['/nosotros']
    },
    { 
      key: 'team', 
      name: 'Colaboradores', 
      description: 'Equipo de trabajo',
      endpoints: ['/colaboradores']
    },
    { 
      key: 'profile', 
      name: 'Perfil', 
      description: 'Perfil de usuario',
      endpoints: ['/profile']
    }
  ];

  const testService = async (serviceKey: string) => {
    setLoading(true);
    setSelectedService(serviceKey);
    setResult('');

    try {
      // Simulación de llamadas a servicios
      // Una vez que limpies los servicios admin, descomenta estas líneas:
      
      let data;
      switch (serviceKey) {
        case 'products':
          // data = await productService.getAll();
          data = { message: 'Productos obtenidos', count: 15 };
          break;
        case 'categories':
          // data = await categoriaService.getAll();
          data = { message: 'Categorías obtenidas', count: 5 };
          break;
        case 'sizes':
          // data = await tallaService.getAll();
          data = { message: 'Tallas obtenidas', count: 8 };
          break;
        case 'locations':
          // data = await localidadService.getAll();
          data = { message: 'Localidades obtenidas', count: 12 };
          break;
        case 'events':
          // data = await eventoService.getAll();
          data = { message: 'Eventos obtenidos', count: 7 };
          break;
        case 'photos':
          // data = await fotoService.getAll();
          data = { message: 'Fotos obtenidas', count: 25 };
          break;
        case 'videos':
          // data = await videoService.getAll();
          data = { message: 'Videos obtenidos', count: 10 };
          break;
        case 'services':
          // data = await servicioService.getAll();
          data = { message: 'Servicios obtenidos', count: 6 };
          break;
        case 'about':
          // data = await nosotrosService.getAll();
          data = { message: 'Información obtenida', mision: 'Preservar tradiciones' };
          break;
        case 'team':
          // data = await colaboradorService.getAll();
          data = { message: 'Colaboradores obtenidos', count: 4 };
          break;
        case 'profile':
          // data = await profileService.getProfile();
          data = { message: 'Perfil obtenido', user: 'Usuario Móvil' };
          break;
        default:
          data = { message: 'Servicio no encontrado' };
      }

      setResult(`✅ ${serviceKey.toUpperCase()} exitoso:\n${JSON.stringify(data, null, 2)}`);
      Alert.alert('Éxito', `Servicio ${serviceKey} ejecutado correctamente`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setResult(`❌ Error en ${serviceKey}:\n${errorMessage}`);
      Alert.alert('Error', `Fallo en servicio ${serviceKey}: ${errorMessage}`);
    } finally {
      setLoading(false);
      setSelectedService('');
    }
  };

  const clearResult = () => {
    setResult('');
    setSelectedService('');
  };

  const testAllServices = async () => {
    setLoading(true);
    setResult('🔄 Probando todos los servicios móviles...\n\n');
    
    for (const service of mobileServices) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay
        setResult(prev => prev + `✅ ${service.name}: OK\n`);
      } catch (error) {
        setResult(prev => prev + `❌ ${service.name}: Error\n`);
      }
    }
    
    setResult(prev => prev + '\n🎉 Prueba completa finalizada');
    setLoading(false);
    Alert.alert('Completado', 'Todos los servicios han sido probados');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🔗 Demo API Móvil</Text>
        <Text style={styles.subtitle}>Servicios sin funciones administrativas</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>📱 API Configuration</Text>
          <Text style={styles.infoText}>URL: https://back-three-gamma.vercel.app/api</Text>
          <Text style={styles.infoText}>Servicios móviles: {mobileServices.length}</Text>
          <Text style={styles.infoText}>Estado: Conectado ✅</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ Servicios Disponibles</Text>
          
          {mobileServices.map((service) => (
            <TouchableOpacity
              key={service.key}
              style={[
                styles.serviceButton,
                selectedService === service.key && styles.serviceButtonActive,
                loading && selectedService === service.key && styles.serviceButtonLoading
              ]}
              onPress={() => testService(service.key)}
              disabled={loading}
            >
              <View style={styles.serviceContent}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <Text style={styles.serviceEndpoint}>
                  {service.endpoints.join(', ')}
                </Text>
              </View>
              {loading && selectedService === service.key && (
                <ActivityIndicator size="small" color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.button, styles.testAllButton]}
            onPress={testAllServices}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '🔄 Probando...' : '🚀 Probar Todos'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearResult}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🗑️ Limpiar</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>📋 Resultado:</Text>
            <ScrollView style={styles.resultScrollView} nestedScrollEnabled>
              <Text style={styles.resultText}>{result}</Text>
            </ScrollView>
          </View>
        )}

        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>📝 Instrucciones:</Text>
          <Text style={styles.instructionsText}>
            1. Elimina los archivos admin (adminHooks.js, adminServices.js, uploadService.js)
          </Text>
          <Text style={styles.instructionsText}>
            2. Limpia las secciones admin en api.js e index.js
          </Text>
          <Text style={styles.instructionsText}>
            3. Descomenta las importaciones de servicios en este archivo
          </Text>
          <Text style={styles.instructionsText}>
            4. ¡Prueba los servicios móviles!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    fontStyle: 'italic',
  },
  infoSection: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  serviceButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  serviceButtonLoading: {
    opacity: 0.7,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  serviceEndpoint: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  testAllButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
    overflow: 'hidden',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
    color: '#333',
  },
  resultScrollView: {
    maxHeight: 200,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  instructionsSection: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#856404',
  },
  instructionsText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 8,
    lineHeight: 20,
  },
});